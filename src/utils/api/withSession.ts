import { createServerSupabaseClient, type Session } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

type Arg = (req: NextApiRequest, res: NextApiResponse, session: Session) => void;

export async function withSession(api: Arg, req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({ error: { message: 'Unauthorized' } });
  }

  api(req, res, session);
}
