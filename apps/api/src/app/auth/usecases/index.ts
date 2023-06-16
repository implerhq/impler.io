import { RegisterUserCommand } from './register-user/register-user.command';
import { RegisterUser } from './register-user/register-user.usecase';
import { LoginUser } from './login-user/login-user.usecase';
import { LoginUserCommand } from './login-user/login-user.command';

export const USE_CASES = [
  RegisterUser,
  LoginUser,
  //
];

export { RegisterUser, LoginUser };
export { RegisterUserCommand, LoginUserCommand };
