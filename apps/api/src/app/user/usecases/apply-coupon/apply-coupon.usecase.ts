import { PaymentAPIService } from '@impler/shared';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class ApplyCoupon {
  constructor(private paymentApiService: PaymentAPIService) {}

  async execute(couponCode: string, userEmail: string, planCode: string) {
    try {
      return await this.paymentApiService.checkAppliedCoupon(couponCode, userEmail, planCode);
    } catch (error) {
      if (error) {
        throw new BadRequestException(error);
      } else throw new InternalServerErrorException();
    }
  }
}
