import { z } from 'zod';

export const brokerageNoteSchema = z.object({
  id: z.string(),
  hashSha256: z.string(),
  relativePath: z.string(),
  brokerId: z.string(),
  noteDate: z.string(),
  parsedStatus: z.string(),
});

export const registerBrokerageNoteSchema = z.object({
  brokerId: z.string(),
  noteDate: z.string(),
  fileName: z.string(),
  base64Content: z.string(),
});
