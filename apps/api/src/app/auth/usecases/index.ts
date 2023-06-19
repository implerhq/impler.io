import { LoginUser } from './login-user/login-user.usecase';
import { RegisterUser } from './register-user/register-user.usecase';
import { RequestForgotPassword } from './request-forgot-password/request-forgot-pasword.usecase';

import { LoginUserCommand } from './login-user/login-user.command';
import { RegisterUserCommand } from './register-user/register-user.command';
import { RequestForgotPasswordCommand } from './request-forgot-password/request-forgot-pasword.command';

export const USE_CASES = [
  RegisterUser,
  LoginUser,
  RequestForgotPassword,
  //
];

export { RegisterUser, LoginUser, RequestForgotPassword };
export { RegisterUserCommand, LoginUserCommand, RequestForgotPasswordCommand };
