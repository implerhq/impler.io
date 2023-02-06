import { Injectable } from '@nestjs/common';
import { AuthService } from '../../services/auth.service';
import { LoginUserCommand } from './login-user.command';

@Injectable()
export class LoginUser {
  constructor(private authService: AuthService) {}
  execute(command: LoginUserCommand) {
    return this.authService.login(command.email, command.password);
  }
}
