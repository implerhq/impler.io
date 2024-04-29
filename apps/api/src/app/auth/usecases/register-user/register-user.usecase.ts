import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';

import { UserRepository } from '@impler/dal';
import { AuthService } from '../../services/auth.service';
import { RegisterUserCommand } from './register-user.command';
import { UniqueEmailException } from '@shared/exceptions/unique-email.exception';
import { LeadService } from '@shared/services/lead.service';
import { PaymentAPIService } from '@impler/shared';

@Injectable()
export class RegisterUser {
  constructor(
    private userRepository: UserRepository,
    private authService: AuthService,
    private leadService: LeadService,
    private paymentAPIService: PaymentAPIService
  ) {}

  async execute(command: RegisterUserCommand) {
    const userWithEmail = await this.userRepository.findOne({
      email: command.email,
    });
    if (userWithEmail) {
      throw new UniqueEmailException();
    }

    const passwordHash = await bcrypt.hash(command.password, 10);
    const user = await this.userRepository.create({
      email: command.email,
      firstName: command.firstName.toLowerCase(),
      lastName: command.lastName?.toLowerCase(),
      password: passwordHash,
    });

    await this.leadService.createLead({
      'First Name': user.firstName,
      'Last Name': user.lastName,
      'Lead Email': user.email,
    });

    const userData = {
      name: user.firstName + ' ' + user.lastName,
      email: user.email,
      externalId: user.email,
    };

    await this.paymentAPIService.createUser(userData);

    const token = this.authService.getSignedToken({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    return {
      showAddProject: true,
      token,
    };
  }
}
