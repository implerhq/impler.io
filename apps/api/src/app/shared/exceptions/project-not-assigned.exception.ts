import { UnprocessableEntityException } from '@nestjs/common';
import { APIMessages } from '../constants';

export class ProjectNotAssignedException extends UnprocessableEntityException {
  constructor() {
    super(APIMessages.PROJECT_NOT_ASSIGNED);
  }
}
