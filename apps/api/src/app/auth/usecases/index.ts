import { RegisterUserCommand } from './register-user/register-user.command';
import { RegisterUser } from './register-user/register-user.usecase';

export const USE_CASES = [
  RegisterUser,
  //
];

export { RegisterUser, RegisterUserCommand };
