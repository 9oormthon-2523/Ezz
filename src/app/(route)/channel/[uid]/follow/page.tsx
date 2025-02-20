import { createClient } from '@/app/_utils/supabase/client';
import FollowClient from '././components/Follow.Client';
import type { FollowingUser } from '@/app/_hooks/channel/follow/useFollowingUsers';

interface FollowPageProps {
  params: Promise<{ uid: string }>;
}

export default async function FollowPage({ params }: FollowPageProps) {
  const uid = (await params).uid;
  const supabase = createClient();

  const { data: followData, error: followError } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', uid)
    .order('created_at', { ascending: false });

  if (followError) {
    throw new Error(followError.message);
  }

  const followingIds = followData.map((follow: any) => follow.following_id);

  const { data: usersData, error: usersError } = await supabase
    .from('users')
    .select('id, nickname, profile_img')
    .in('id', followingIds);

  if (usersError) {
    throw new Error(usersError.message);
  }

  const usersWithFollowerCounts: FollowingUser[] = await Promise.all(
    usersData.map(async (user: any) => {
      const { count, error: countError } = await supabase
        .from('follows')
        .select('*', { count: 'exact' })
        .eq('following_id', user.id);

      if (countError) {
        console.error(`팔로워 수 가져오기 오류 (사용자 ID: ${user.id}):`, countError);
      }

      return {
        ...user,
        followerCount: count || 0,
      };
    })
  );

  return <FollowClient initialFollowingUsers={usersWithFollowerCounts} uid={uid} />;
}
