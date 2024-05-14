import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Put, Query, UseGuards } from '@nestjs/common';

import { GetImportCounts, CancelSubscription, GetActiveSubscription, UpdateUser } from './usecases';
import { JwtAuthGuard } from '@shared/framework/auth.gaurd';
import { IJwtPayload, ACCESS_KEY_NAME } from '@impler/shared';
import { UserSession } from '@shared/framework/user.decorator';
import { UpdateUserDto } from './usecases/update-user/update-user.dto';

@ApiTags('User')
@Controller('/user')
@UseGuards(JwtAuthGuard)
@ApiSecurity(ACCESS_KEY_NAME)
export class UserController {
  constructor(
    private getImportsCount: GetImportCounts,
    private getActiveSubscription: GetActiveSubscription,
    private cancelSubscription: CancelSubscription,
    private updateCustomer: UpdateUser
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

  @Put()
  @ApiOperation({
    summary: 'Update User Information',
  })
  async updateUserPaymentMethod(@UserSession() user: IJwtPayload, @Body() payload: UpdateUserDto) {
    return this.updateCustomer.execute(user.email, {
      paymentMethodId: payload.paymentMethodId,
    });
  }
}
