import { Injectable } from '@nestjs/common';
import { parseRssFeed } from '@shared/services/parse-xml';
import { UserJobEntity, UserJobRepository } from '@impler/dal';

@Injectable()
export class CreateUserJob {
  constructor(private readonly userJobRepository: UserJobRepository) {}

  async execute({ _templateId, url }: { url: string; _templateId: string }): Promise<UserJobEntity> {
    const { rssKeyHeading } = await parseRssFeed(url);

    return await this.userJobRepository.create({
      url,
      headings: rssKeyHeading,
      _templateId: _templateId,
    });
  }
}
