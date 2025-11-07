/* eslint-disable no-magic-numbers */
import { Types } from 'mongoose';
import { subMonths, subWeeks, subYears, format, subDays } from 'date-fns';

import { UserEntity } from '../user';
import { Upload } from './upload.schema';
import { Environment } from '../environment';
import { UploadEntity } from './upload.entity';
import { BaseRepository } from '../base-repository';
import { TemplateEntity, TemplateRepository } from '../template';

export class UploadRepository extends BaseRepository<UploadEntity> {
  private templateRepository: TemplateRepository;
  constructor() {
    super(Upload, UploadEntity);
    this.templateRepository = new TemplateRepository();
  }
  async getUploadProcessInformation(uploadId: string): Promise<UploadEntity> {
    return await Upload.findById(uploadId).populate('_uploadedFileId', 'path originalName');
  }
  async getUploadWithTemplate(uploadId: string, fields: string[]): Promise<UploadEntity> {
    return await Upload.findById(uploadId).populate('_templateId', fields.join(' '));
  }
  async getImportCount(_userId: string, startDate: Date, endDate: Date) {
    const userProjects = await Environment.find(
      {
        'apiKeys._userId': new Types.ObjectId(_userId),
      },
      '_projectId'
    );

    const result = await this.aggregate([
      {
        $addFields: {
          _templateId: { $toObjectId: '$_templateId' },
        },
      },
      {
        $lookup: {
          from: 'templates',
          localField: '_templateId',
          foreignField: '_id',
          as: 'template',
        },
      },
      { $unwind: '$template' },
      {
        $match: {
          $and: [
            {
              'template._projectId': {
                $in:
                  Array.isArray(userProjects) && userProjects.length > 0
                    ? userProjects.map((project) => new Types.ObjectId(project._projectId))
                    : [],
              },
            },
            {
              uploadedDate: {
                $gte: startDate,
                $lte: endDate,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          statusCount: {
            totalRecords: '$totalRecords',
            status: '$status',
            uploadDate: '$uploadedDate',
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { date: '$uploadedDate', format: '%Y-%m-%d' },
          },
          records: {
            $addToSet: '$statusCount',
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    return result;
  }
  async getStats(_projectId: string) {
    const now: number = Date.now();
    const yearBefore = subYears(now, 1);
    const monthBefore = subMonths(now, 1);
    const weekBefore = subWeeks(now, 1);

    const templateIds = await this.templateRepository.getProjectTemplateIds(_projectId);

    const result = await this.aggregate([
      {
        $match: {
          _templateId: {
            $in: templateIds,
          },
          createdAt: {
            $gte: yearBefore,
          },
        },
      },
      {
        $group: {
          _id: null,
          yearly: {
            $sum: 1,
          },
          monthly: {
            $sum: {
              $cond: [
                {
                  $gte: ['$createdAt', monthBefore],
                },
                1,
                0,
              ],
            },
          },
          weekly: {
            $sum: {
              $cond: [
                {
                  $gte: ['$createdAt', weekBefore],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const stats = result[0] || {};

    return {
      yearly: stats.yearly || 0,
      monthly: stats.monthly || 0,
      weekly: stats.weekly || 0,
    };
  }
  async getList(_projectId: string, name?: string, date?: string, page?: number, limit?: number) {
    const templateIds = await this.templateRepository.getProjectTemplateIds(_projectId, name);
    const dateLowerStart = date ? new Date(date) : undefined;
    const dateUpperEnd = date ? new Date(date) : undefined;
    if (dateUpperEnd) dateUpperEnd.setDate(dateUpperEnd.getDate() + 1);

    const results = await this.aggregate([
      {
        $match: {
          _templateId: {
            $in: templateIds,
          },
          ...(dateLowerStart &&
            dateUpperEnd && {
              uploadedDate: {
                $gte: dateLowerStart,
                $lt: dateUpperEnd,
              },
            }),
        },
      },

      {
        $addFields: {
          type: 'Manual',
          importType: 'Manual',
          sortDate: '$uploadedDate',
        },
      },

      {
        $unionWith: {
          coll: 'userjobs',
          pipeline: [
            {
              $addFields: {
                templateIdObj: { $toObjectId: '$_templateId' },
              },
            },
            {
              $match: {
                templateIdObj: {
                  $in: templateIds.map((id) => new Types.ObjectId(id)),
                },
                ...(dateLowerStart &&
                  dateUpperEnd && {
                    nextRun: {
                      $gte: dateLowerStart,
                      $lt: dateUpperEnd,
                    },
                  }),
              },
            },
            {
              $addFields: {
                type: 'AutoImport',
                importType: 'AutoImport',
                uploadedDate: '$nextRun',
                sortDate: '$nextRun',
                totalRecords: { $ifNull: ['$totalRecords', 0] },
                validRecords: { $ifNull: ['$validRecords', 0] },
                invalidRecords: { $ifNull: ['$invalidRecords', 0] },
                originalFileName: { $concat: ['AutoImport: ', '$url'] },
                _templateId: '$_templateId',
              },
            },
          ],
        },
      },
      {
        $sort: {
          sortDate: -1,
        },
      },
      {
        $facet: {
          totalRecords: [
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
          uploads: [
            // Apply pagination
            ...(typeof page === 'number' && typeof limit === 'number'
              ? [{ $skip: (page - 1) * limit }, { $limit: limit }]
              : []),
            // Add templateId for lookup
            { $addFields: { templateId: { $toObjectId: '$_templateId' } } },
            // Lookup template details
            {
              $lookup: {
                from: 'templates',
                localField: 'templateId',
                foreignField: '_id',
                as: '_template',
              },
            },
            {
              $unwind: {
                path: '$_template',
                preserveNullAndEmptyArrays: true,
              },
            },
            // Add computed destination field
            {
              $addFields: {
                destination: {
                  $cond: {
                    if: { $eq: ['$_template.destination', 'frontend'] },
                    then: 'Frontend',
                    else: {
                      $cond: {
                        if: { $eq: ['$_template.destination', 'webhook'] },
                        then: 'Webhook',
                        else: {
                          $cond: {
                            if: { $eq: ['$_template.destination', 'bubble'] },
                            then: 'Bubble.io',
                            else: { $ifNull: ['$_template.destination', 'Unknown'] },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            // Project final fields
            {
              $project: {
                _id: 1,
                _uploadedFileId: 1,
                name: 1,
                uploadedDate: 1,
                totalRecords: 1,
                validRecords: 1,
                invalidRecords: 1,
                originalFileName: 1,
                status: 1,
                type: 1,
                importType: 1,
                destination: 1,
                cron: 1,
                nextRun: 1,
                url: 1,
                externalUserId: 1,
                _template: {
                  name: 1,
                  destination: 1,
                  integration: 1,
                },
                webhookLogs: 1,
              },
            },
          ],
        },
      },
    ]);

    if (!results[0]) return { totalRecords: 0, uploads: [] };
    const { totalRecords, uploads: result } = results[0];

    return {
      totalRecords: totalRecords[0] ? totalRecords[0].count : 0,
      uploads: result,
    };
  }
  async getStatsFeed(_projectId: string, days: number) {
    const now: number = Date.now();
    const daysBefore = subDays(now, days);
    daysBefore.setDate(daysBefore.getDate() + 1);

    const templateIds = await this.templateRepository.getProjectTemplateIds(_projectId);

    const result: { date: string; count: number }[] = await this.aggregate([
      {
        $match: {
          _templateId: {
            $in: templateIds,
          },
          createdAt: {
            $gte: daysBefore,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%d/%m/%Y',
              date: '$createdAt',
            },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          count: 1,
        },
      },
    ]);

    const resultObj = result.reduce((acc, obj) => {
      acc[obj.date] = obj.count;

      return acc;
    }, []);
    const formattedResults = [];
    for (let i = 0; i < days; i++) {
      formattedResults.push({
        date: daysBefore.toLocaleDateString(),
        count: resultObj[format(daysBefore, 'dd/MM/yyyy')] || 0,
      });
      daysBefore.setDate(daysBefore.getDate() + 1);
    }

    return formattedResults;
  }

  async getUserEmailFromUploadId(uploadId: string): Promise<string> {
    const uploadInfoWithTemplate = await Upload.findById(uploadId).populate([
      {
        path: '_templateId',
      },
    ]);
    const environment = await Environment.find({
      _projectId: (uploadInfoWithTemplate._templateId as unknown as TemplateEntity)._projectId,
    }).populate([
      {
        path: 'apiKeys._userId',
      },
    ]);

    return (environment[0].apiKeys[0]._userId as unknown as UserEntity).email;
  }

  async getUserIdFromUploadId(uploadId: string): Promise<string> {
    const uploadInfoWithTemplate = await Upload.findById(uploadId).populate([
      {
        path: '_templateId',
      },
    ]);
    const environment = await Environment.find({
      _projectId: (uploadInfoWithTemplate._templateId as unknown as TemplateEntity)._projectId,
    }).populate([
      {
        path: 'apiKeys._userId',
      },
    ]);

    return (environment[0].apiKeys[0]._userId as unknown as UserEntity)._id;
  }
}
