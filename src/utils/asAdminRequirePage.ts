import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { GetServerSidePropsContext } from 'next';

export const asAdminRequirePage = async (ctx: GetServerSidePropsContext) => {
  const supabase = createPagesServerClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || session.user.id !== process.env.ADMIN_UUID) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  };
};
