import { Injectable } from '@nestjs/common';
import { UserRepository, TemplateRepository } from '@impler/dal';
import { IImportConfig, PaymentAPIService } from '@impler/shared';

@Injectable()
export class GetImportConfig {
  constructor(
    private userRepository: UserRepository,
    private paymentAPIService: PaymentAPIService,
    private templateRepository: TemplateRepository
  ) {}

  async execute(projectId: string): Promise<IImportConfig> {
    const userEmail = await this.userRepository.findUserEmailFromProjectId(projectId);

    const removeBrandingAvailable = await this.paymentAPIService.checkEvent(userEmail, 'REMOVE_BRANDING');

    const template = await this.templateRepository.findOne({
      _projectId: projectId,
    });

    if (!template) {
      throw new Error('Template not found');
    }

    const importMode = template.mode;

    return { showBranding: !removeBrandingAvailable, mode: importMode };
  }
}
