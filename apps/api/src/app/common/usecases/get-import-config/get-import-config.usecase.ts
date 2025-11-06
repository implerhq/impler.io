import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository, TemplateRepository, TemplateEntity } from '@impler/dal';
import { BILLABLEMETRIC_CODE_ENUM, IImportConfig } from '@impler/shared';
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
    const isFeatureAvailableMap = new Map<string, boolean>();

    Object.values(BILLABLEMETRIC_CODE_ENUM).forEach((code) => {
      isFeatureAvailableMap.set(code, false);
    });

    try {
      for (const billableMetricCode of Object.keys(BILLABLEMETRIC_CODE_ENUM)) {
        const isAvailable = await this.paymentAPIService.checkEvent({
          email: userEmail,
          billableMetricCode: BILLABLEMETRIC_CODE_ENUM[billableMetricCode],
        });
        isFeatureAvailableMap.set(billableMetricCode, isAvailable);
      }
    } catch (error) {}

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

    return {
      ...Object.fromEntries(isFeatureAvailableMap),
      showBranding: !isFeatureAvailableMap.get(BILLABLEMETRIC_CODE_ENUM.REMOVE_BRANDING),
      mode: template?.mode,
      title: template?.name,
    };
  }
}
