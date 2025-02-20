'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FollowChannel from './FollowChannel.server';
import Image from 'next/image';
import SearchInput from './SearchProfileInput.client';
import type { FollowingUser } from '@/app/_hooks/channel/follow/useFollowingUsers';

interface FollowClientProps {
  initialFollowingUsers: FollowingUser[];
  uid: string;
}

const FollowClient = ({ initialFollowingUsers, uid }: FollowClientProps) => {
  const [followingUsers] = useState<FollowingUser[]>(initialFollowingUsers);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

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

export default FollowClient;
