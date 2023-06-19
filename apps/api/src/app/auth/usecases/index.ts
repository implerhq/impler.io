import { LoginUser } from './login-user/login-user.usecase';
import { RegisterUser } from './register-user/register-user.usecase';
import { ResetPassword } from './reset-password/reset-password.usecase';
import { RequestForgotPassword } from './request-forgot-password/request-forgot-pasword.usecase';

import { LoginUserCommand } from './login-user/login-user.command';
import { RegisterUserCommand } from './register-user/register-user.command';
import { ResetPasswordCommand } from './reset-password/reset-password.command';
import { RequestForgotPasswordCommand } from './request-forgot-password/request-forgot-pasword.command';

export const USE_CASES = [
  RegisterUser,
  LoginUser,
  ResetPassword,
  RequestForgotPassword,
  //
];

export { RegisterUser, LoginUser, RequestForgotPassword, ResetPassword };
export { RegisterUserCommand, LoginUserCommand, RequestForgotPasswordCommand, ResetPasswordCommand };
