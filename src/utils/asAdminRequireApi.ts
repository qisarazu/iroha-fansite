import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

export const asAdminRequireApi = async (handler: NextApiHandler, req: NextApiRequest, res: NextApiResponse) => {
  const supabase = createServerSupabaseClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || session.user.id !== process.env.ADMIN_UUID) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  await handler(req, res);
};
