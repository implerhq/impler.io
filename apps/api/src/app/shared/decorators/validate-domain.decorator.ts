import { SetMetadata } from '@nestjs/common';

export const IS_DOMAIN_VALIDATION_REQUIRED_KEY = 'isDomainValidationRequired';
export const ValidateDomain = () => SetMetadata(IS_DOMAIN_VALIDATION_REQUIRED_KEY, true);
