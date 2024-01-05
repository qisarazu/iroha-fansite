import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getActivities } from '../../../services/activities/server';
import { CreateForm } from './components/CreateForm';
import { List } from './components/List/List';

export default async function Page() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user.id !== process.env.ADMIN_UUID) {
    redirect('/');
  }

  const activities = await getActivities();

  return (
    <section>
      <h1>Activity</h1>

      <CreateForm />

      <List activities={activities} />
    </section>
  );
}
