import { z } from 'zod';

export const ipcResultSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.discriminatedUnion('success', [
    z.object({ success: z.literal(true), data: dataSchema }),
    z.object({
      success: z.literal(false),
      error: z.object({ code: z.string(), message: z.string() }),
    }),
  ]);

export type IpcResult<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

export const healthcheckResponseSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.string(),
  version: z.string()
});

export type HealthcheckResponse = z.infer<typeof healthcheckResponseSchema>;
