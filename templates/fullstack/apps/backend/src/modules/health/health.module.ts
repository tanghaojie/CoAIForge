import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { HealthController } from './health.controller.js'
import { HealthService } from './health.service.js'
import { HealthExceptionFilter } from './health.exception-filter.js'

@Module({
  controllers: [HealthController],
  providers: [HealthService, { provide: APP_FILTER, useClass: HealthExceptionFilter }],
})
export class HealthModule {}
