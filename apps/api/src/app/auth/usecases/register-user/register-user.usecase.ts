import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CONSTANTS } from '@shared/constants';
import { IStrategyResponse } from '@shared/types/auth.types';
import { AuthService } from '../../services/auth.service';
import { RegisterUserCommand } from './register-user.command';

@Injectable()
export class RegisterUser {
  constructor(private authService: AuthService) {}

  async execute(command: RegisterUserCommand): Promise<IStrategyResponse> {
    return this.authService.authenticate({
      profile: {
        firstName: command.firstName,
        lastName: command.lastName,
        email: command.email,
        avatar_url: CONSTANTS.DEFAULT_USER_AVATAR,
        password: bcrypt.hashSync(command.password, CONSTANTS.PASSWORD_SALT),
      },
      validateUniqueEmail: false,
    });
  }
}
