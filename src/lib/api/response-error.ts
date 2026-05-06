import * as Sentry from '@sentry/nextjs';
import type { NextApiResponse } from 'next';

import { ApiError, internalServerError } from './ApiError';

export function responseError(res: NextApiResponse, error: unknown) {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({ error: { statusCode: error.statusCode, message: error.message } });
  }

  console.error(error);
  Sentry.captureException(error);
  const e = internalServerError();
  return res.status(e.statusCode).json({ error: { statusCode: e.statusCode, message: e.message } });
}
