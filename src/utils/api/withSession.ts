import { createServerSupabaseClient, type Session } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

import { unauthorized } from '../../lib/api/ApiError';

type Arg = (req: NextApiRequest, res: NextApiResponse, session: Session) => void;

export async function withSession(api: Arg, req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw unauthorized();
  }

  return api(req, res, session);
}
