import { ApiTags } from '@nestjs/swagger';
import { Defaults, IJwtPayload } from '@impler/shared';
import { Body, Controller, Get, Post, Put, Query, Param, Delete } from '@nestjs/common';

import { UpdateFlowRequestDTo } from './dtos/update-flow.dto';
import { UserSession } from '@shared/framework/user.decorator';
import { ValidateMongoId } from '@shared/validations/valid-mongo-id.validation';
import {
  CreateFlow,
  CreateFlowCommand,
  DeleteFlow,
  DeleteFlowCommand,
  GetFlows,
  GetFlowsCommand,
  UpdateFlow,
  UpdateFlowCommand,
} from './usecases';

@Controller('/flow')
@ApiTags('Flow')
export class FlowController {
  constructor(
    private createFlow: CreateFlow,
    private getFlows: GetFlows,
    private updateFlow: UpdateFlow,
    private deleteFlow: DeleteFlow
  ) {}

  @Post()
  async createFlowRoute(@UserSession() user: IJwtPayload) {
    return this.createFlow.execute(
      CreateFlowCommand.create({
        _userId: user._id,
      })
    );
  }

  @Get()
  async getFlowsRoutes(
    @UserSession() user: IJwtPayload,
    @Query('page') page = Defaults.ONE,
    @Query('limit') limit = Defaults.PAGE_LIMIT
  ) {
    return this.getFlows.execute(
      GetFlowsCommand.create({
        _userId: user._id,
        limit: Number(limit),
        offset: (Number(page) - Defaults.ONE) * Number(limit),
      })
    );
  }

  @Put(':flowId')
  async updateFlowRoute(
    @UserSession() user: IJwtPayload,
    @Param('flowId', ValidateMongoId) _flowId: string,
    @Body() body: UpdateFlowRequestDTo
  ) {
    return this.updateFlow.execute(
      UpdateFlowCommand.create({
        _flowId,
        _userId: user._id,
        ...body,
      })
    );
  }

  @Delete(':flowId')
  async deleteFlowRoute(@UserSession() user: IJwtPayload, @Param('flowId', ValidateMongoId) _flowId: string) {
    return this.deleteFlow.execute(
      DeleteFlowCommand.create({
        _flowId,
        _userId: user._id,
      })
    );
  }
}
