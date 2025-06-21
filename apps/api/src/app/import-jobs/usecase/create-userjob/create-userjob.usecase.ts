import { Injectable } from '@nestjs/common';
import { UserJobEntity, UserJobRepository } from '@impler/dal';
import { CreateUserJobCommand } from './create-userjob.command';
import { APIMessages } from '@shared/constants';
import { BadRequestException } from '@nestjs/common';
import { RSSXMLService } from '@impler/services';
import { isValidXMLMimeType } from '@shared/helpers/common.helper';
import { WebSocketService } from '@shared/services';

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
  }: CreateUserJobCommand): Promise<UserJobEntity> {
    const rssService = new RSSXMLService(url);
    console.log('🚀 Starting job with session ID:', webSocketSessionId);

    const mimeType = await rssService.getMimeType(url);

    if (isValidXMLMimeType(mimeType)) {
      console.log('📡 WebSocket service methods available:', {
        sendProgress: typeof this.webSocketService.sendProgress,
        sendError: typeof this.webSocketService.sendError,
        sendCompletion: typeof this.webSocketService.sendCompletion,
      });

      // Join the session

      try {
        const abortController = new AbortController();
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
        } catch (_) {
          console.warn('⚠️ Failed to parse extra data, using original');
        }

        return await this.userJobRepository.create({
          url,
          extra,
          authHeaderValue,
          headings: rssXmlParsedDataKeys?.keys || [],
          _templateId: _templateId,
          externalUserId: externalUserId || (formattedExtra as unknown as Record<string, any>)?.externalUserId,
        });
      } catch (error) {
        if (error.message === 'Request aborted') {
          console.log('Job cancelled by user');
          throw error;
        }
        throw error;
      } finally {
      }
    } else {
      throw new BadRequestException(APIMessages.INVALID_RSS_URL);
    }
  }
}
