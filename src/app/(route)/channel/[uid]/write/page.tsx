import WriteForm from './components/WriteForm.client';
import { createClient } from '@/app/_utils/supabase/client';

interface PageProps {
  params: Promise<{ uid: string }>;

}

export default async function Page({ params }: PageProps) {
  const supabase = createClient();
  const { uid } = await params;
  let nickname = '';

  if (uid) {
    const { data, error } = await supabase
      .from('users')
      .select('nickname')
      .eq('id', uid)
      .single();
    if (!error && data) {
      nickname = data.nickname;
    }
  }

  return <WriteForm initialNickname={nickname} uid={uid} />;
}
