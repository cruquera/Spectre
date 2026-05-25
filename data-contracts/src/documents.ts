import { z } from 'zod';

export const registerDocumentSchema = z.object({
  documentType: z.string(),
  documentDate: z.string(),
  fileName: z.string(),
  base64Content: z.string(),
});
