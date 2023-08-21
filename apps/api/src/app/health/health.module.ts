import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { SharedModule } from '@shared/shared.module';
import { QueueService } from '@shared/services/queue.service';
import { HealthController } from './health.controller';

@Module({
  imports: [SharedModule, TerminusModule],
  controllers: [HealthController],
  providers: [QueueService],
})
export class HealthModule {}
