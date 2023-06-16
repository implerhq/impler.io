import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';

import { UserRepository } from '@impler/dal';
import { APIMessages } from '@shared/constants';
import { AuthService } from '../../services/auth.service';
import { RegisterUserCommand } from './register-user.command';

@Injectable()
export class RegisterUser {
  constructor(private userRepository: UserRepository, private authService: AuthService) {}

  async execute(command: RegisterUserCommand) {
    const userWithEmail = await this.userRepository.findOne({
      email: command.email,
    });
    if (userWithEmail) {
      throw new BadRequestException(APIMessages.EMAIL_ALREADY_EXISTS);
    }

    const passwordHash = await bcrypt.hash(command.password, 10);
    const user = await this.userRepository.create({
      email: command.email,
      firstName: command.firstName.toLowerCase(),
      lastName: command.lastName?.toLowerCase(),
      password: passwordHash,
    });

    const authToken = this.authService.getSignedToken({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return {
      user: await this.userRepository.findById(user._id),
      token: authToken,
    };
  }
}
