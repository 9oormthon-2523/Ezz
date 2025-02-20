'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/app/_utils/supabase/client';

export interface FollowingUser {
  id: string;
  nickname: string;
  profile_img: string | null;
  followerCount: number;
}

export const useFollowingUsers = (uid: string) => {
  const [followingUsers, setFollowingUsers] = useState<FollowingUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchFollowingUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!uid) throw new Error('채널 ID가 유효하지 않습니다.');

      const { data: followData, error: followError } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', uid)
        .order('created_at', { ascending: false });

      if (followError) throw new Error(followError.message);

      const followingIds = followData.map((follow: any) => follow.following_id);

      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, nickname, profile_img')
        .in('id', followingIds);

      if (usersError) throw new Error(usersError.message);

      const usersWithFollowerCounts = await Promise.all(
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

      setFollowingUsers(usersWithFollowerCounts);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('오류');
      }
    } finally {
      setLoading(false);
    }
  }, [supabase, uid]);

  useEffect(() => {
    if (uid) {
      fetchFollowingUsers();
    }
  }, [uid, fetchFollowingUsers]);

  return { followingUsers, loading, error, refetch: fetchFollowingUsers };
};
