import { Controller, Get, Inject } from '@nestjs/common'
import type { HealthResponse } from '@{{PROJECT_NAME}}/api-contract/health'
import { HealthService } from './health.service.js'

@Controller('health')
export class HealthController {
  constructor(@Inject(HealthService) private readonly health: HealthService) {}

  @Get()
  getHealth(): HealthResponse {
    return this.health.getHealth()
  }
}
