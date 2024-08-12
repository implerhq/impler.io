import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository, TemplateRepository, TemplateEntity } from '@impler/dal';
import { AVAILABLE_BILLABLEMETRIC_CODE_ENUM, IImportConfig } from '@impler/shared';
import { PaymentAPIService } from '@impler/services';
import { APIMessages } from '@shared/constants';

@Injectable()
export class GetImportConfig {
  constructor(
    private userRepository: UserRepository,
    private paymentAPIService: PaymentAPIService,
    private templateRepository: TemplateRepository
  ) {}

  async execute(projectId: string, templateId?: string): Promise<IImportConfig> {
    const userEmail = await this.userRepository.findUserEmailFromProjectId(projectId);

    const removeBrandingAvailable = await this.paymentAPIService.checkEvent({
      email: userEmail,
      billableMetricCode: AVAILABLE_BILLABLEMETRIC_CODE_ENUM.REMOVE_BRANDING,
    });

    let template: TemplateEntity;
    if (templateId) {
      template = await this.templateRepository.findOne({
        _projectId: projectId,
        _id: templateId,
      });

      if (!template) {
        throw new BadRequestException(APIMessages.TEMPLATE_NOT_FOUND);
      }
    }

    return { showBranding: !removeBrandingAvailable, mode: template?.mode, title: template?.name };
  }
}
