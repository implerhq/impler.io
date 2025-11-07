import { BadRequestException, Injectable } from '@nestjs/common';
import { UserJobEntity, UserJobRepository } from '@impler/dal';
import { CreateUserJobCommand } from './create-userjob.command';
import { APIMessages } from '@shared/constants';
import { RSSXMLService } from '@impler/services';
import { getMimeType, isValidXMLMimeType } from '@shared/helpers/common.helper';
import { WebSocketService } from '@shared/services';
const parser = require('cron-parser');
import * as dayjs from 'dayjs';
@Injectable()
export class CreateUserJob {
  constructor(
    private readonly webSocketService: WebSocketService,
    private readonly userJobRepository: UserJobRepository
  ) {}

  async execute({
    webSocketSessionId,
    url,
    extra,
    _templateId,
    externalUserId,
    authHeaderValue,
    cron,
  }: CreateUserJobCommand): Promise<UserJobEntity> {
    const rssService = new RSSXMLService(url);

    try {
      const mimeType = await getMimeType(url);

      if (isValidXMLMimeType(mimeType)) {
        const abortController = new AbortController();

        this.webSocketService.registerSessionAbort(webSocketSessionId, abortController);

        const rssXmlParsedDataKeys = await rssService.parseXMLAndExtractData({
          xmlUrl: url,
          sessionId: webSocketSessionId,
          sendProgress: this.webSocketService.sendProgress,
          sendError: this.webSocketService.sendError,
          sendCompletion: this.webSocketService.sendCompletion,
          abortSignal: abortController.signal,
        });

        let formattedExtra = extra || '{}';
        try {
          formattedExtra = JSON.parse(extra);
        } catch (_) {}

        const nextRun = this.calculateInitialNextRun(cron);

        return await this.userJobRepository.create({
          url,
          extra,
          authHeaderValue,
          headings: rssXmlParsedDataKeys?.keys || [],
          _templateId: _templateId,
          externalUserId: externalUserId || (formattedExtra as unknown as Record<string, any>)?.externalUserId,
          nextRun,
          cron,
        });
      } else {
        throw new BadRequestException(APIMessages.INVALID_RSS_URL);
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  calculateInitialNextRun(cronExpression: string): Date {
    try {
      if (!cronExpression || typeof cronExpression !== 'string' || cronExpression.trim() === '') {
        return dayjs().add(5, 'minutes').toDate();
      }

      const interval = parser.parseExpression(cronExpression.trim(), {
        tz: 'Asia/Kolkata',
      });
      const nextCronTime = dayjs(interval.next().toDate());
      const now = dayjs();

      if (nextCronTime.isBefore(now.add(1, 'minute'))) {
        const nextOccurrence = dayjs(interval.next().toDate());

        return nextOccurrence.toDate();
      }

      return nextCronTime.toDate();
    } catch (error) {
      return dayjs().add(5, 'minutes').toDate();
    }
  }
}
