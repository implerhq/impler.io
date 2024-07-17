import { BadRequestException, Injectable } from '@nestjs/common';
import { FileMimeTypesEnum } from '@impler/shared';
import { APIMessages } from '@shared/constants';
import { parseRssFeed, getMimeType } from '@shared/services/parse-xml';
import { UserJobEntity, UserJobRepository } from '@impler/dal';

@Injectable()
export class CreateUserJob {
  constructor(private readonly userJobRepository: UserJobRepository) {}

  async execute({ _templateId, url }: { url: string; _templateId: string }): Promise<UserJobEntity> {
    const mimeType = await getMimeType(url);

    if (mimeType !== FileMimeTypesEnum.XML) {
      throw new BadRequestException(APIMessages.INVALID_RSS_URL);
    } else {
      const { rssKeyHeading } = await parseRssFeed(url);

      return await this.userJobRepository.create({
        url,
        headings: rssKeyHeading,
        _templateId: _templateId,
      });
    }
  }
}
