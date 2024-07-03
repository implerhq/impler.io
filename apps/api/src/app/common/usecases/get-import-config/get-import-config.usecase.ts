import { Injectable } from '@nestjs/common';
import { UserRepository } from '@impler/dal';
import { IImportConfig, PaymentAPIService } from '@impler/shared';

@Injectable()
export class GetImportConfig {
  constructor(
    private userRepository: UserRepository,
    private paymentAPIService: PaymentAPIService
  ) {}

  async execute(projectId: string): Promise<IImportConfig> {
    const userEmail = await this.userRepository.findUserEmailFromProjectId(projectId);

    const removeBrandingAvailable = await this.paymentAPIService.checkEvent(userEmail, 'REMOVE_BRANDING');

    return { showBranding: !removeBrandingAvailable };
  }
}
