import { Injectable } from '@nestjs/common';
import { WebhookLogRepository } from '@impler/dal';
import { PaginationResult } from '@impler/shared';
import { WebhookLogsCommand } from './webhook-logs.command';

@Injectable()
export class WebhookLogs {
  constructor(private webhookLogRepository: WebhookLogRepository) {}

  async execute({ uploadId, page = 1, limit = 10, isRetry }: WebhookLogsCommand): Promise<PaginationResult> {
    const skip = (page - 1) * limit;

    const matchQuery: any = { _uploadId: uploadId };
    if (isRetry !== undefined) {
      matchQuery.isRetry = isRetry;
    }

    const [logs, totalCount] = await Promise.all([
      this.webhookLogRepository.find(matchQuery, '', {
        sort: { callDate: -1 },
        skip,
        limit,
      }),
      this.webhookLogRepository.count(matchQuery),
    ]);

    return {
      data: logs,
      limit,
      page,
      totalPages: Math.ceil(totalCount / limit),
      totalRecords: totalCount,
    };
  }
}
