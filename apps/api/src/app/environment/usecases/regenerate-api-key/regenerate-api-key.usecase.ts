import { Injectable } from '@nestjs/common';
import { IJwtPayload } from '@impler/shared';
import { EnvironmentRepository } from '@impler/dal';
import { AuthService } from 'app/auth/services/auth.service';
import { GenerateUniqueApiKey } from '../generate-api-key/generate-api-key.usecase';

@Injectable()
export class RegenerateAPIKey {
  constructor(
    private generateUniqueApiKey: GenerateUniqueApiKey,
    private environmentRepository: EnvironmentRepository,
    private authService: AuthService
  ) {}

  async execute(userInfo: IJwtPayload) {
    const accessToken = await this.generateUniqueApiKey.execute();
    await this.environmentRepository.update(
      {
        _projectId: userInfo._projectId,
        'apiKeys._userId': userInfo._id,
      },
      {
        $set: {
          'apiKeys.$.key': accessToken,
        },
      }
    );
    const token = this.authService.getSignedToken(
      {
        _id: userInfo._id,
        email: userInfo.email,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        profilePicture: userInfo.profilePicture,
        accessToken,
      },
      userInfo._projectId
    );

    return {
      token,
      accessToken,
    };
  }
}
