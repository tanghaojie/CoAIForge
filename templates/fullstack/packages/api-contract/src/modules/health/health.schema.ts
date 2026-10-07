import { z } from 'zod'

export const healthResponseSchema = z
  .object({
    status: z.literal(0),
    data: z.object({ status: z.literal('ok'), timestamp: z.iso.datetime() }).strict(),
  })
  .strict()

export const failureResponseSchema = z
  .object({
    status: z.int().refine(function nonzero(value) {
      return value !== 0
    }),
    err: z.string().min(1),
  })
  .strict()

export const errorCodes = {
  unauthorized: 1001,
  notFound: 1004,
  requestRejected: 1400,
  internal: 1500,
} as const
export type HealthResponse = z.infer<typeof healthResponseSchema>
export type FailureResponse = z.infer<typeof failureResponseSchema>
