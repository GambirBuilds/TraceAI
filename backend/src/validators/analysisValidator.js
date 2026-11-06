/**
 * TraceAI Analysis Validation Schemas (Zod)
 */

import { z } from 'zod';

export const textAnalysisSchema = z.object({
  text: z.string({
    required_error: 'Text payload is required.'
  })
  .min(50, 'Text must be at least 50 characters for meaningful linguistic stylometry.')
  .max(100000, 'Text payload cannot exceed 100,000 characters.'),
  language: z.string().default('auto'),
  options: z.object({
    inspectStylometry: z.boolean().optional(),
    inspectPerplexity: z.boolean().optional(),
    detectFormulaicTransitions: z.boolean().optional()
  }).optional()
});

export const queryAnalysesSchema = z.object({
  contentType: z.enum(['all', 'text', 'image', 'audio', 'video']).optional(),
  status: z.enum(['all', 'pending', 'processing', 'completed', 'inconclusive', 'failed']).optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0)
});
