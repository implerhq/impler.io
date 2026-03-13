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
    const results = await Promise.allSettled(
      billableMetricCodes.map((billableMetricCode) =>
        this.paymentAPIService.checkEvent({ email: userEmail, billableMetricCode })
      )
    );

    const isFeatureAvailableMap = new Map<string, boolean>(
      billableMetricCodes.map((code, i) => [
        code,
        results[i].status === 'fulfilled' ? (results[i] as PromiseFulfilledResult<boolean>).value : false,
      ])
    );

    return {
      ...Object.fromEntries(isFeatureAvailableMap),
      showBranding: !isFeatureAvailableMap.get(BILLABLEMETRIC_CODE_ENUM.REMOVE_BRANDING),
      mode: template?.mode,
      title: template?.name,
    };
  }
}
