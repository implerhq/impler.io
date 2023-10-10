/* eslint-disable no-magic-numbers */
import { subMonths, subWeeks, subYears, format, subDays } from 'date-fns';

import { TemplateRepository } from '../template';
import { BaseRepository } from '../base-repository';
import { UploadEntity } from './upload.entity';
import { Upload } from './upload.schema';

export class UploadRepository extends BaseRepository<UploadEntity> {
  private templateRepository: TemplateRepository;
  constructor() {
    super(Upload, UploadEntity);
    this.templateRepository = new TemplateRepository();
  }

  async getUploadInformation(uploadId: string): Promise<UploadEntity> {
    return await Upload.findById(uploadId).populate('_allDataFileId', 'path name');
  }
  async getUploadInvalidDataInformation(uploadId: string): Promise<UploadEntity> {
    return await Upload.findById(uploadId).populate('_invalidDataFileId', 'path name');
  }
  async getUploadProcessInformation(uploadId: string): Promise<UploadEntity> {
    return await Upload.findById(uploadId)
      .populate('_uploadedFileId', 'path originalName')
      .populate('_invalidDataFileId', 'path name')
      .populate('_validDataFileId', 'path name');
  }
  async getUploadWithTemplate(uploadId: string, fields: string[]): Promise<UploadEntity> {
    return await Upload.findById(uploadId).populate('_templateId', fields.join(' '));
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

    const uploads = await this.aggregate([
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
            {
              $sort: {
                uploadedDate: -1,
              },
            },
            ...(typeof page === 'number' && typeof limit === 'number'
              ? [{ $skip: (page - 1) * limit }, { $limit: limit }]
              : []),
            { $addFields: { templateId: { $toObjectId: '$_templateId' } } },
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
            {
              $project: {
                _id: 1,
                name: 1,
                uploadedDate: 1,
                totalRecords: 1,
                validRecords: 1,
                originalFileName: 1,
                status: 1,
                _template: {
                  name: 1,
                },
              },
            },
          ],
        },
      },
    ]);
    if (!uploads[0]) return { totalRecords: 0, uploads: [] };
    const { totalRecords, uploads: result } = uploads[0];

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
}
