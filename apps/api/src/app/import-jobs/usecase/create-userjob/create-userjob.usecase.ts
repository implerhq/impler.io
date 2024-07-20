import { BadRequestException, Injectable } from '@nestjs/common';
import { FileMimeTypesEnum } from '@impler/shared';
import { APIMessages } from '@shared/constants';
import { UserJobEntity, UserJobRepository } from '@impler/dal';
import { RSSService } from '@shared/services';

@Injectable()
export class CreateUserJob {
  constructor(
    private readonly userJobRepository: UserJobRepository,
    private readonly rssService: RSSService
  ) {}

  async execute({ _templateId, url }: { url: string; _templateId: string }): Promise<UserJobEntity> {
    if ((await this.rssService.getMimeType(url)) !== FileMimeTypesEnum.XML) {
      throw new BadRequestException(APIMessages.INVALID_RSS_URL);
    } else {
      const { rssKeyHeading } = await this.rssService.parseRssFeed(url);

      return await this.userJobRepository.create({
        url,
        headings: rssKeyHeading,
        _templateId: _templateId,
      });
    }
  }
}
