'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/app/_utils/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import FollowChannel from '../components/FollowChannel';
import Image from 'next/image';
import SearchInput from '../components/SearchProfileInput';

interface FollowingUser {
  id: string;
  nickname: string;
  profile_img: string | null;
  followerCount: number;
}

const Follow = () => {
  const [followingUsers, setFollowingUsers] = useState<FollowingUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { uid } = useParams();
  const router = useRouter();

  const supabase = createClient();

  const fetchFollowingUsers = async () => {
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

      const followingIds = followData.map((follow) => follow.following_id);

      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, nickname, profile_img')
        .in('id', followingIds);

      if (usersError) throw new Error(usersError.message);

      const usersWithFollowerCounts = await Promise.all(
        usersData.map(async (user) => {
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
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowingUsers();
  }, [uid]);

  if (loading) {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">오류: {error}</div>;
  }

  const filteredUsers = followingUsers.filter((user) =>
    user.nickname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-full pb-8 px-6">
      <div className="flex flex-row justify-between mb-8">
        <div className="flex pt-2 text-lg font-bold">
          이 채널이 팔로우하는 다른 채널
        </div>
        <SearchInput
          value={searchQuery}
          placeholder="채널 이름을 입력하세요."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-10 pb-40">
          <Image
            src="/channelPage/no_content.svg"
            alt="No Content"
            width={140}
            height={140}
          />
          <p className="text-center text-gray-500 mt-4">
            팔로우한 사용자가 없습니다.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="cursor-pointer"
              onClick={() => router.push(`/channel/${user.id}`)}
            >
              <FollowChannel
                id={user.id}
                nickname={user.nickname}
                profile_img={user.profile_img}
                followerCount={user.followerCount}
              />
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Follow;
