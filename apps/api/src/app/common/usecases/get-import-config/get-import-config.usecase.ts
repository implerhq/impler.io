import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository, TemplateRepository } from '@impler/dal';
import { IImportConfig, PaymentAPIService } from '@impler/shared';
import { APIMessages } from '@shared/constants';

@Injectable()
export class GetImportConfig {
  constructor(
    private userRepository: UserRepository,
    private paymentAPIService: PaymentAPIService,
    private templateRepository: TemplateRepository
  ) {}

  async execute(projectId: string, templateId: string): Promise<IImportConfig> {
    const userEmail = await this.userRepository.findUserEmailFromProjectId(projectId);

    const removeBrandingAvailable = await this.paymentAPIService.checkEvent(userEmail, 'REMOVE_BRANDING');

    const template = await this.templateRepository.findOne({
      _projectId: projectId,
      ...(templateId ? { _id: templateId } : {}),
    });

    if (!template) {
      throw new BadRequestException(APIMessages.TEMPLATE_NOT_FOUND);
    }

    return { showBranding: !removeBrandingAvailable, mode: template.mode, title: template.name };
  }
}
