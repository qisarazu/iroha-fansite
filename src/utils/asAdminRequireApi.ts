import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { unauthorized } from '../lib/api/ApiError';
import { responseError } from '../lib/api/response-error';

export const asAdminRequireApi = async (handler: NextApiHandler, req: NextApiRequest, res: NextApiResponse) => {
  const supabase = createPagesServerClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || session.user.id !== process.env.ADMIN_UUID) {
    responseError(res, unauthorized());
    return;
  }

  await handler(req, res);
};
