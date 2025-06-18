import { BadRequestException, Injectable } from '@nestjs/common';
import { RSSXMLService } from '@impler/services';
import { isValidXMLMimeType } from '@shared/helpers/common.helper';
import { APIMessages } from '@shared/constants';
import { UserJobEntity, UserJobRepository } from '@impler/dal';
import { CreateUserJobCommand } from './create-userjob.command';

@Injectable()
export class CreateUserJob {
  constructor(
    private readonly rssService: RSSXMLService,
    private readonly userJobRepository: UserJobRepository
  ) {}

  async execute({
    url,
    extra,
    _templateId,
    externalUserId,
    authHeaderValue,
  }: CreateUserJobCommand): Promise<UserJobEntity> {
    const mimeType = await this.rssService.getMimeType(url);
    if (isValidXMLMimeType(mimeType)) {
      const rssXmlParsedDataKeys = await this.rssService.parseXMLAndExtractData(url);

      console.log('Key Heading s ->', rssXmlParsedDataKeys);
      let formattedExtra = extra || '{}';
      try {
        formattedExtra = JSON.parse(extra);
      } catch (_) {}

      return await this.userJobRepository.create({
        url,
        extra,
        authHeaderValue,
        headings: rssXmlParsedDataKeys.keys,
        _templateId: _templateId,
        externalUserId: externalUserId || (formattedExtra as unknown as Record<string, any>)?.externalUserId,
      });
    } else {
      throw new BadRequestException(APIMessages.INVALID_RSS_URL);
    }
  }
}
