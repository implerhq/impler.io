import { BaseRepository } from '../base-repository';
import { WebhookLogEntity } from './webhook-log.entity';
import { WebhookLog } from './webhook-log.schema';
import { FilterQuery } from 'mongoose';

export class WebhookLogRepository extends BaseRepository<WebhookLogEntity> {
  constructor() {
    super(WebhookLog, WebhookLogEntity);
  }

  async getWebhookLogsByUploadId(
    uploadId: string,
    options: {
      page?: number;
      limit?: number;
      isRetry?: boolean;
    } = {}
  ): Promise<{
    data: WebhookLogEntity[];
    total: number;
    hasMore: boolean;
    nextPage?: number;
  }> {
    const { page = 1, limit = 10, isRetry } = options;
    const skip = (page - 1) * limit;

    const matchQuery: FilterQuery<WebhookLogEntity> = { _uploadId: uploadId };
    if (isRetry !== undefined) {
      matchQuery.isRetry = isRetry;
    }

    const result = await this.paginate(matchQuery, '', {
      sort: { callDate: -1 },
      skip,
      limit,
    });

    if (!result) {
      return {
        data: [],
        total: 0,
        hasMore: false,
      };
    }

    const hasMore = result.total > page * limit;
    const nextPage = hasMore ? page + 1 : undefined;

    return {
      data: result.data,
      total: result.total,
      hasMore,
      nextPage,
    };
  }
}
