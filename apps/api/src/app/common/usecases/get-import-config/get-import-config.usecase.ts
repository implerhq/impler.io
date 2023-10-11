import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '@impler/dal';
import { IImportConfig } from '@impler/shared';

@Injectable()
export class GetImportConfig {
  constructor(private projectRepository: ProjectRepository) {}

  async execute(projectId: string): Promise<IImportConfig> {
    const projectInfo = await this.projectRepository.findById(projectId, 'showBranding');

    return { showBranding: projectInfo.showBranding };
  }
}
