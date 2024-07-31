import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { DalService } from '@impler/dal';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { version } from '../../../package.json';
import { Defaults } from '@impler/shared';
import { StorageService } from '@impler/services';
import { QueueService } from '@shared/services/queue.service';

@Controller('health-check')
@ApiExcludeController()
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private dalService: DalService,
    private storageService: StorageService,
    private queueService: QueueService
  ) {}

  @Get()
  @HealthCheck()
  healthCheck() {
    return this.healthCheckService.check([
      () => {
        return {
          db: {
            status: this.dalService.connection.readyState === Defaults.READY_STATE ? 'up' : 'down',
          },
          storage: {
            status: this.storageService.isConnected() ? 'up' : 'down',
          },
          apiVersion: {
            version,
            status: 'up',
          },
          rabbitmq: {
            status: this.queueService.isQueueConnected ? 'up' : 'down',
          },
        };
      },
    ]);
  }
}
