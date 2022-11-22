import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { DalService } from '@impler/dal';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { version } from '../../../package.json';
import { Defaults, StorageService } from '@impler/shared';

@Controller('health-check')
@ApiExcludeController()
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private dalService: DalService,
    private storageService: StorageService
  ) {}

  @Get()
  @HealthCheck()
  healthCheck() {
    return this.healthCheckService.check([
      async () => {
        return {
          db: {
            status: this.dalService.connection.readyState === Defaults.READY_STATE ? 'up' : 'down',
          },
        };
      },
      async () => {
        return {
          apiVersion: {
            version,
            status: 'up',
          },
        };
      },
      async () => {
        return {
          storage: {
            status: (await this.storageService.isConnected()) ? 'up' : 'down',
          },
        };
      },
    ]);
  }
}
