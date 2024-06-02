import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { Controller, Delete, Get, Param, Put, Query, UseGuards } from '@nestjs/common';

import {
  GetImportCounts,
  CancelSubscription,
  GetActiveSubscription,
  UpdatePaymentMethod,
  ConfirmIntentId,
  DeleteUserPaymentMethod,
  GetTransactionHistory,
} from './usecases';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { IJwtPayload, ACCESS_KEY_NAME } from '@impler/shared';
import { UserSession } from '@shared/framework/user.decorator';
import { RetrievePaymentMethods } from './usecases/retrive-payment-methods/retrive-payment-methods.usecase';

@ApiTags('User')
@Controller('/user')
@UseGuards(JwtAuthGuard)
@ApiSecurity(ACCESS_KEY_NAME)
export class UserController {
  constructor(
    private getImportsCount: GetImportCounts,
    private getActiveSubscription: GetActiveSubscription,
    private cancelSubscription: CancelSubscription,
    private updatePaymentMethod: UpdatePaymentMethod,
    private confirmIntentId: ConfirmIntentId,
    private retrivePaymentMethods: RetrievePaymentMethods,
    private deleteUserPaymentMethod: DeleteUserPaymentMethod,
    private getTransactionHistory: GetTransactionHistory
  ) {}

  @Get('/import-count')
  @ApiOperation({
    summary: 'Get Import Count',
  })
  async getImportCountRoute(
    @UserSession() user: IJwtPayload,
    @Query('start') start: string,
    @Query('end') end: string
  ) {
    return this.getImportsCount.execute({
      _userId: user._id,
      start,
      end,
    });
  }

  @Get('/subscription')
  @ApiOperation({
    summary: 'Get Active Subscription Information',
  })
  async getActiveSubscriptionRoute(@UserSession() user: IJwtPayload) {
    return this.getActiveSubscription.execute(user.email);
  }

  @Delete('/subscription')
  @ApiOperation({
    summary: 'Cancel active subscription for user',
  })
  async cancelSubscriptionRoute(@UserSession() user: IJwtPayload) {
    return this.cancelSubscription.execute(user.email);
  }

  @Put('/setup-intent/:paymentId')
  @ApiOperation({
    summary: 'Setup User Payment Intent',
  })
  async setupEMandateIntent(@UserSession() user: IJwtPayload, @Param('paymentId') paymentId: string) {
    return this.updatePaymentMethod.execute(user.email, paymentId);
  }

  @Put('/confirm-payment-intent-id/:intentId')
  @ApiOperation({
    summary: 'Pass the Payment Intent Id If user cancels the E-Mandate Authorization',
  })
  async savePaymentIntentIdRoute(@UserSession() user: IJwtPayload, @Param('intentId') intentId: string) {
    return this.confirmIntentId.execute(user.email, intentId);
  }

  @Get('/payment-methods')
  @ApiOperation({
    summary: 'Retrieve the Payment Methods of the User',
  })
  async retriveUserPaymentMethods(@UserSession() user: IJwtPayload) {
    return this.retrivePaymentMethods.execute(user.email);
  }

  @Delete('/payment-methods/:paymentMethodId')
  @ApiOperation({
    summary: 'Detach or Delete the Payment Method of the User',
  })
  async deletePaymentMethodRoute(@Param('paymentMethodId') paymentMethodId: string) {
    return this.deleteUserPaymentMethod.execute(paymentMethodId);
  }

  @Get('/transactions/history')
  @ApiOperation({
    summary: 'Get Transaction History for User',
  })
  async getTransactionHistoryRoute(@UserSession() user: IJwtPayload) {
    return this.getTransactionHistory.execute(user.email);
  }
}
