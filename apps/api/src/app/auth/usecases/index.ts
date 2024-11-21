import { LoginUser } from './login-user/login-user.usecase';
import { UpdateUser } from './update-user/update-user.usecase';
import { OnboardUser } from './onboard-user/onboard-user.usecase';
import { RegisterUser } from './register-user/register-user.usecase';
import { ResetPassword } from './reset-password/reset-password.usecase';
import { RequestForgotPassword } from './request-forgot-password/request-forgot-pasword.usecase';

import { Verify } from './verify/verify.usecase';
import { ResendOTP } from './resend-otp/resend-otp.usecase';
import { OnboardUserCommand } from './onboard-user/onboard-user.command';
import { ResetPasswordCommand } from './reset-password/reset-password.command';
import { RequestForgotPasswordCommand } from './request-forgot-password/request-forgot-pasword.command';

import { CreateProject } from 'app/project/usecases';
import { SaveSampleFile, UpdateImageColumns } from '@shared/usecases';
import { CreateEnvironment, GenerateUniqueApiKey } from 'app/environment/usecases';
import { CreateTemplate, UpdateCustomization, UpdateTemplateColumns } from 'app/template/usecases';

export const USE_CASES = [
  Verify,
  LoginUser,
  UpdateUser,
  OnboardUser,
  RegisterUser,
  ResetPassword,
  CreateProject,
  SaveSampleFile,
  CreateTemplate,
  CreateEnvironment,
  UpdateImageColumns,
  UpdateCustomization,
  GenerateUniqueApiKey,
  UpdateTemplateColumns,
  RequestForgotPassword,
  ResendOTP,
  //
];

export { OnboardUserCommand, ResetPasswordCommand, RequestForgotPasswordCommand };
export { Verify, RegisterUser, LoginUser, RequestForgotPassword, ResetPassword, OnboardUser, ResendOTP, UpdateUser };
