import React from 'react';
import { createClient } from '@/app/_utils/supabase/server';
import { redirect } from 'next/navigation';
import Popup from '../studio/[uid]/_components/Popup/Popup.server';

const page = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect(`/streaming-view/${user.id}`);

  return <Popup />;
};

export default page;
