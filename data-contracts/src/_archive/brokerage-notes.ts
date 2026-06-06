import { z } from 'zod';

export const brokerageNoteSchema = z.object({
  brokerId: z.string(),
  hashSha256: z.string(),
  id: z.string(),
  noteDate: z.string(),
  parsedStatus: z.string(),
  relativePath: z.string(),
});

export const registerBrokerageNoteSchema = z.object({
  base64Content: z.string(),
  brokerId: z.string(),
  fileName: z.string(),
  noteDate: z.string(),
});
