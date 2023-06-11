import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export async function getSession(arg: Parameters<typeof createPagesServerClient>[0]) {
  const supabase = createPagesServerClient(arg);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}
