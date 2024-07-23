import { BadRequestException, Injectable } from '@nestjs/common';
import { FileMimeTypesEnum } from '@impler/shared';
import { APIMessages } from '@shared/constants';
import { UserJobEntity, UserJobRepository } from '@impler/dal';
import { RSSService } from '@shared/services';
import { CreateUserJobCommand } from './create-userjob.command';

@Injectable()
export class CreateUserJob {
  constructor(
    private readonly userJobRepository: UserJobRepository,
    private readonly rssService: RSSService
  ) {}

  async execute({ _templateId, url }: CreateUserJobCommand): Promise<UserJobEntity> {
    const mimeType = await this.rssService.getMimeType(url);
    if (mimeType === FileMimeTypesEnum.XML || mimeType === FileMimeTypesEnum.TEXTXML) {
      const { rssKeyHeading } = await this.rssService.parseRssFeed(url);

      return await this.userJobRepository.create({
        url,
        headings: rssKeyHeading,
        _templateId: _templateId,
      });
    } else {
      throw new BadRequestException(APIMessages.INVALID_RSS_URL);
    }
  }
}
