import { Catch, HttpException, type ArgumentsHost, type ExceptionFilter } from '@nestjs/common'
import type { FastifyReply } from 'fastify'
import { errorCodes, failureResponseSchema } from '@{{PROJECT_NAME}}/api-contract/health'

@Catch()
export class HealthExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const reply = host.switchToHttp().getResponse<FastifyReply>()
    const status = exception instanceof HttpException ? exception.getStatus() : 500
    const httpStatus = status === 401 ? 401 : status === 404 ? 404 : status >= 500 ? 500 : 200
    const code =
      status === 401
        ? errorCodes.unauthorized
        : status === 404
          ? errorCodes.notFound
          : status >= 500
            ? errorCodes.internal
            : errorCodes.requestRejected
    const err =
      status === 401
        ? 'Unauthorized'
        : status === 404
          ? 'Resource not found'
          : status >= 500
            ? 'Internal server error'
            : 'Request rejected'
    void reply.status(httpStatus).send(failureResponseSchema.parse({ status: code, err }))
  }
}
