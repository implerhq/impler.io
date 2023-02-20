import { CreateFlowCommand } from './create-flow/create-flow.command';
import { CreateFlow } from './create-flow/create-flow.usecase';
import { GetFlowsCommand } from './get-flows/get-flows.command';
import { GetFlows } from './get-flows/get-flows.usecase';
import { UpdateFlow } from './update-flow/update-flow.usecase';
import { UpdateFlowCommand } from './update-flow/update-flow.command';
import { DeleteFlow } from './delete-flow/delete-flow.usecase';
import { DeleteFlowCommand } from './delete-flow/delete-flow.command';

export const USE_CASES = [
  CreateFlow,
  GetFlows,
  UpdateFlow,
  DeleteFlow,
  //
];
export { CreateFlow, GetFlows, UpdateFlow, DeleteFlow };
export { CreateFlowCommand, GetFlowsCommand, UpdateFlowCommand, DeleteFlowCommand };
