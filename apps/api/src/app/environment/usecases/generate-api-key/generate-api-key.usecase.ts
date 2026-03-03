import * as crypto from 'crypto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { EnvironmentRepository } from '@impler/dal';
import { VARIABLES } from '@shared/constants';

const API_KEY_GENERATION_MAX_RETRIES = 10;

@Injectable()
export class GenerateUniqueApiKey {
  constructor(private environmentRepository: EnvironmentRepository) {}

  async execute(): Promise<string> {
    let apiKey = '';
    let count = 0;
    let isApiKeyUsed = true;
    while (isApiKeyUsed) {
      apiKey = this.generateApiKey();
      const environment = await this.environmentRepository.findByApiKey(apiKey);
      isApiKeyUsed = environment ? true : false;
      count += VARIABLES.ONE;

      if (count === API_KEY_GENERATION_MAX_RETRIES) {
        const errorMessage = 'Clashing of the API key generation';
        throw new InternalServerErrorException(new Error(errorMessage), errorMessage);
      }
    }

    return apiKey as string;
  }

  /**
   * Generates a cryptographically secure API key with 256-bit entropy.
   * Replaces the deprecated `hat` library with Node.js native crypto.
   */
  private generateApiKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
