import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Put, Query, UseGuards } from '@nestjs/common';

import {
  GetImportCounts,
  CancelSubscription,
  GetActiveSubscription,
  UpdatePaymentMethod,
  ConfirmIntentId,
  DeleteUserPaymentMethod,
  GetTransactionHistory,
  ApplyCoupon,
  Checkout,
  Subscription,
  RetrievePaymentMethods,
  UpdateSubscriptionPaymentMethod,
} from './usecases';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { IJwtPayload, ACCESS_KEY_NAME } from '@impler/shared';
import { UserSession } from '@shared/framework/user.decorator';
import { CancelSubscriptionDto } from './dto/cancel-subscription.dto';

@ApiTags('User')
@Controller('/user')
@UseGuards(JwtAuthGuard)
@ApiSecurity(ACCESS_KEY_NAME)
export class UserController {
  constructor(
    private checkout: Checkout,
    private applyCoupon: ApplyCoupon,
    private getImportsCount: GetImportCounts,
    private getActiveSubscription: GetActiveSubscription,
    private cancelSubscription: CancelSubscription,
    private updatePaymentMethod: UpdatePaymentMethod,
    private confirmIntentId: ConfirmIntentId,
    private getTransactionHistory: GetTransactionHistory,
    private retrivePaymentMethods: RetrievePaymentMethods,
    private deleteUserPaymentMethod: DeleteUserPaymentMethod,
    private subscription: Subscription,
    private updateSubscriptionPaymentMethod: UpdateSubscriptionPaymentMethod
  ) {}

  @Get('/import-count')
  @ApiOperation({
    summary: 'Get Import Count',
  })
  @UseGuards(JwtAuthGuard)
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
    return this.getActiveSubscription.execute(user._projectId);
  }

  @Delete('/subscription')
  @ApiOperation({
    summary: 'Cancel active subscription for user',
  })
  async cancelSubscriptionRoute(
    @UserSession() user: IJwtPayload,
    @Body() cancelSubscriptionDto: CancelSubscriptionDto
  ) {
    return this.cancelSubscription.execute(user._projectId, cancelSubscriptionDto.reasons);
  }

  @Put('/setup-intent/:paymentMethodId')
  @ApiOperation({
    summary: 'Setup User Payment Intent',
  })
  async setupEmandateIntent(@UserSession() user: IJwtPayload, @Param('paymentMethodId') paymentMethodId: string) {
    return this.updatePaymentMethod.execute(user._projectId, paymentMethodId);
  }

  @Put('/payment-method/:paymentMethodId')
  @ApiOperation({
    summary: 'Update User Payment Method',
  })
  async updatePaymentMethodRoute(@UserSession() user: IJwtPayload, @Param('paymentMethodId') paymentMethodId: string) {
    return this.updatePaymentMethod.execute(user._projectId, paymentMethodId);
  }

  @Put('/subscription-payment-method/:paymentMethodId')
  @ApiOperation({
    summary: 'Update User Payment Method',
  })
  async updateSubscriptionPaymentMethodRoute(
    @UserSession() user: IJwtPayload,
    @Param('paymentMethodId') paymentMethodId: string
  ) {
    return this.updateSubscriptionPaymentMethod.execute(user._projectId, paymentMethodId);
  }

  @Put('/confirm-payment-intent-id/:intentId')
  @ApiOperation({
    summary: 'Pass the Payment Intent Id If user cancels the E-Mandate Authorization',
  })
  async savePaymentIntentIdRoute(@UserSession() user: IJwtPayload, @Param('intentId') intentId: string) {
    return this.confirmIntentId.execute(user._projectId, intentId);
  }

  @Get('/payment-methods')
  @ApiOperation({
    summary: 'Retrieve the cards of the User',
  })
  async retriveUserPaymentMethods(@UserSession() user: IJwtPayload) {
    return this.retrivePaymentMethods.execute(user._projectId);
  }

  @Delete('/payment-methods/:paymentMethodId')
  @ApiOperation({
    summary: 'Detach or Delete the card of the User',
  })
  async deletePaymentMethodRoute(@Param('paymentMethodId') paymentMethodId: string) {
    return this.deleteUserPaymentMethod.execute(paymentMethodId);
  }

  @Get('/transactions/history')
  @ApiOperation({
    summary: 'Get Transaction History for User',
  })
  async getTransactionHistoryRoute(@UserSession() user: IJwtPayload) {
    return this.getTransactionHistory.execute(user._projectId);
  }

  @Get('/coupons/:couponCode/apply/:planCode')
  @ApiOperation({
    summary:
      'Check if a Particular coupon is available to apply for a particular plan and if the coupon is valid or not',
  })
  async applyCouponRoute(
    @UserSession() user: IJwtPayload,
    @Param('couponCode') couponCode: string,
    @Param('planCode') planCode: string
  ) {
    return this.applyCoupon.execute(couponCode, user.email, planCode);
  }

  @Get('/checkout')
  @ApiOperation({
    summary: 'Get Tax Information and checkout details',
  })
  async checkoutRoute(
    @Query('planCode') planCode: string,
    @UserSession() user: IJwtPayload,
    @Query('paymentMethodId') paymentMethodId: string,
    @Query('couponCode') couponCode?: string
  ) {
    return this.checkout.execute({
      planCode: planCode,
      projectId: user._projectId,
      paymentMethodId: paymentMethodId,
      couponCode: couponCode,
    });
  }

  @Get('/subscribe')
  @ApiOperation({
    summary: 'Make successful Plan Purchase and begin subscription',
  })
  async newSubscriptionRoute(
    @Query('planCode') planCode: string,
    @UserSession() user: IJwtPayload,
    @Query('paymentMethodId') paymentMethodId: string,
    @Query('couponCode') couponCode?: string
  ) {
    return await this.subscription.execute({
      projectId: user._projectId,
      planCode,
      selectedPaymentMethod: paymentMethodId,
      couponCode,
    });
  }
}
