import { BadRequestException, Injectable } from '@nestjs/common';
import { UserJobEntity, UserJobRepository } from '@impler/dal';
import { CreateUserJobCommand } from './create-userjob.command';
import { APIMessages } from '@shared/constants';
import { RSSXMLService } from '@impler/services';
import { getMimeType, isValidXMLMimeType } from '@shared/helpers/common.helper';
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

        return await this.userJobRepository.create({
          url,
          extra,
          authHeaderValue,
          headings: rssXmlParsedDataKeys?.keys || [],
          _templateId: _templateId,
          externalUserId: externalUserId || (formattedExtra as unknown as Record<string, any>)?.externalUserId,
        });
      } else {
        throw new BadRequestException(APIMessages.INVALID_RSS_URL);
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
