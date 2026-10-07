import { Injectable } from '@nestjs/common'
import { healthResponseSchema, type HealthResponse } from '@{{PROJECT_NAME}}/api-contract/health'

@Injectable()
export class HealthService {
  getHealth(): HealthResponse {
    return healthResponseSchema.parse({
      status: 0,
      data: { status: 'ok', timestamp: new Date().toISOString() },
    })
  }
}
