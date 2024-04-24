import { Global, MiddlewareConsumer, Module, NestModule, Provider, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as passport from 'passport';
import { USE_CASES } from './usecases';
import { CONSTANTS } from '@shared/constants';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { SharedModule } from '../shared/shared.module';
import { GitHubStrategy } from './services/passport/github.strategy';
import { JwtStrategy } from './services/passport/jwt.strategy';
import { LeadService } from '@shared/services/lead.service';
import { PaymentAPIService } from '@shared/services/payment.api.service';

const AUTH_STRATEGIES: Provider[] = [JwtStrategy];

if (process.env.GITHUB_OAUTH_CLIENT_ID) {
  AUTH_STRATEGIES.push(GitHubStrategy);
}

@Global()
@Module({
  imports: [
    SharedModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secretOrKeyProvider: () => process.env.JWT_SECRET as string,
      signOptions: {
        expiresIn: CONSTANTS.maxAge,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ...AUTH_STRATEGIES, ...USE_CASES, LeadService, PaymentAPIService],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    if (process.env.GITHUB_OAUTH_CLIENT_ID) {
      consumer
        .apply(
          passport.authenticate('github', {
            session: false,
            scope: ['user:email'],
          })
        )
        .forRoutes({
          path: '/auth/github',
          method: RequestMethod.GET,
        });
    }
  }
}
