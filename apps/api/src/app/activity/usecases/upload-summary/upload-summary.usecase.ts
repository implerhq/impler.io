import { UploadRepository } from '@impler/dal';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadSummary {
  // eslint-disable-next-line no-magic-numbers
  private readonly feedDays = 7;
  constructor(private uploadRepository: UploadRepository) {}

  async execute(_projectid: string) {
    const stats = await this.uploadRepository.getStats(_projectid);
    const feed = await this.uploadRepository.getStatsFeed(_projectid, this.feedDays);

    return {
      ...stats,
      uploads: feed,
    };
  }
}
