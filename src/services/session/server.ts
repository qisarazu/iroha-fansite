import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export async function getSession(arg: Parameters<typeof createServerSupabaseClient>[0]) {
  const supabase = createServerSupabaseClient(arg);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}
