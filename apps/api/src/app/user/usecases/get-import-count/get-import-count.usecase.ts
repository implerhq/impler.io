import { Injectable } from '@nestjs/common';
import { UploadRepository } from '@impler/dal';
import { UploadStatusEnum } from '@impler/shared';

interface IImportCountItem {
  _id: string;
  records: { totalRecords: number; status: UploadStatusEnum }[];
}

@Injectable()
export class GetImportCounts {
  constructor(private uploadRepository: UploadRepository) {}

  async execute({ _userId, start, end }: { _userId: string; start?: string; end?: string }) {
    const startOfMonthDate = new Date();
    startOfMonthDate.setDate(1);
    const endOfMonthDate = new Date();
    endOfMonthDate.setMonth(endOfMonthDate.getMonth() + 1);

    const records = (await this.uploadRepository.getImportCount(
      _userId,
      start ? new Date(start) : startOfMonthDate,
      end ? new Date(end) : endOfMonthDate
    )) as IImportCountItem[];

    return records.map((item) => ({
      date: item._id,
      records: item.records.reduce(
        (obj, recordItem) => {
          obj[recordItem.status] += recordItem.totalRecords;

          return obj;
        },
        {
          [UploadStatusEnum.COMPLETED]: 0,
          [UploadStatusEnum.TERMINATED]: 0,
          [UploadStatusEnum.MAPPING]: 0,
          [UploadStatusEnum.REVIEWING]: 0,
        }
      ),
    }));
  }
}
