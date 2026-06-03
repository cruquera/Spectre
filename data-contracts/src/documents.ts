import { z } from 'zod';

export const registerDocumentSchema = z.object({
  base64Content: z.string(),
  documentDate: z.string(),
  documentType: z.string(),
  fileName: z.string(),
});
