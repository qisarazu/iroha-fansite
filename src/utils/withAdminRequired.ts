import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { supabase } from './supabaseClient';

export async function withAdminRequired(handler: NextApiHandler, req: NextApiRequest, res: NextApiResponse) {
  const { user } = await supabase.auth.api.getUserByCookie(req);
  if (!user || user.id !== process.env.ADMIN_UUID) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  await handler(req, res);
}
