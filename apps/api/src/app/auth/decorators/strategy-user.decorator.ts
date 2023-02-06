import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IStrategyResponse } from '@shared/types/auth.types';

export const StrategyUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return request.user as IStrategyResponse;
});
