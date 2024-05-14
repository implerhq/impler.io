import { Injectable } from '@nestjs/common';
import { PaymentAPIService } from '@impler/shared';
import { UpdateUserCommand } from './update-user.command';

@Injectable()
export class UpdateUser {
  constructor(private paymentApiService: PaymentAPIService) {}

  async execute(userEmail: string, updateUser: UpdateUserCommand) {
    return await this.paymentApiService.updatePaymentMethod(userEmail, updateUser.paymentMethodId);
  }
}
