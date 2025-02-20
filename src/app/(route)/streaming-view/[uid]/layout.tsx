import React, { ReactNode } from 'react';
import { createClient } from '@/app/_utils/supabase/server';
import { UIDProvider } from '@/app/_store/context/useUid';
import Popup from '../../studio/[uid]/_components/Popup/Popup.server';
import Block from '../../studio/[uid]/_components/Block/Block.server';

const StudioLayout = async ({ children, params }: { children: ReactNode; params: Promise<{ uid: string }> }) => {
  const { uid } = await params;
  const match = await matchStatus(uid);

  if (match === 'noUser') return <Popup />;
  if (match === 'notMatch') return <Block uid={uid} />;

  return (
    <UIDProvider uid={uid}>
      <div className="fixed w-full h-full">
        <section className="flex overflow-auto flex-1 flex-col bg-zinc-300 h-full">{children}</section>
      </div>
    </UIDProvider>
  );
};

export default StudioLayout;

const matchStatus = async (uid: string): Promise<'noUser' | 'notMatch' | 'match'> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return 'noUser';
  if (user.id !== uid) return 'notMatch';
  return 'match';
};
