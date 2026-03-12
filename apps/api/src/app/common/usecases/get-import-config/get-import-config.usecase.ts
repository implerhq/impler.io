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
    const [userEmail, template] = await Promise.all([
      this.userRepository.findUserEmailFromProjectId(projectId),
      templateId
        ? this.templateRepository.findOne({ _projectId: projectId, _id: templateId })
        : Promise.resolve(undefined as TemplateEntity),
    ]);

    if (templateId && !template) {
      throw new BadRequestException(APIMessages.TEMPLATE_NOT_FOUND);
    }

    const billableMetricCodes = Object.values(BILLABLEMETRIC_CODE_ENUM);
    const isFeatureAvailableMap = new Map<string, boolean>(billableMetricCodes.map((code) => [code, false]));

    const results = await Promise.allSettled(
      billableMetricCodes.map((code) =>
        this.paymentAPIService.checkEvent({
          email: userEmail,
          billableMetricCode: code,
        })
      )
    );

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        isFeatureAvailableMap.set(billableMetricCodes[index], result.value);
      }
    });

    return {
      ...Object.fromEntries(isFeatureAvailableMap),
      showBranding: !isFeatureAvailableMap.get(BILLABLEMETRIC_CODE_ENUM.REMOVE_BRANDING),
      mode: template?.mode,
      title: template?.name,
    };
  }
}
