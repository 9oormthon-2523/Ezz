'use client';

import React from 'react';
import { useRouter, useParams, useSelectedLayoutSegment } from 'next/navigation';
import Header from '@/app/_components/Header/Header.server';
import NavBar from '@/app/(route)/(main)/_components/NavBar/NavBar.client';
import useNavToggle from '@/app/_store/stores/main/useNavToggle.client';
import ChannelProfile from '@/app/(route)/channel/[uid]/components/ChannelProfile.server';
import Footer from '@/app/_components/Footer/footer';
import useChannelData from '@/app/_hooks/channel/useChannelData';

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  const { isOpen } = useNavToggle();
  const { uid } = useParams();
  const router = useRouter();
  const activeSegment = useSelectedLayoutSegment();
  const isCommunityActive =
    !activeSegment || ['post', 'comment', 'detail', 'edit'].includes(activeSegment || '');

  const {
    userInfo,
    loggedInUserId,
    followerCount,
    isFollowing,
    handleFollow,
    handleUnfollow,
  } = useChannelData(uid as string);

  const handleTabClick = (path: string) => {
    router.push(path);
  };

  const handleChannelStudioClick = () => {
    if (uid) router.push(`/studio/${uid}`);
  };

  const handleChannelManagementClick = () => {
    if (uid) router.push(`/channel/${uid}/settings`);
  };

  if (!userInfo) return <p>로딩 중...</p>;

  const isLoggedInUser = loggedInUserId === uid;

  return (
    <div>
      <Header />
      {isOpen && <NavBar />}
      <div className="mx-12 ml-28">
        <div className="h-28" />
        <ChannelProfile
          img_url={userInfo.img_url}
          nickname={userInfo.nickname}
          followerCount={followerCount}
          context={userInfo.channel_intro}
          isFollowing={isFollowing}
          isLoggedInUser={isLoggedInUser}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
          onChannelStudioClick={handleChannelStudioClick}
          onChannelManagementClick={handleChannelManagementClick}
        />
        <div className="flex flex-row mb-6">
          <p
            className={`text-xl font-black ml-4 mt-6 p-2 cursor-pointer ${
              isCommunityActive
                ? 'text-black border-b-4 border-black'
                : 'text-gray-400'
            }`}
            onClick={() => handleTabClick(`/channel/${uid}`)}
          >
            커뮤니티
          </p>
          <p
            className={`text-xl font-black ml-4 mt-6 p-2 cursor-pointer ${
              activeSegment === 'follow'
                ? 'text-black border-b-4 border-black'
                : 'text-gray-400'
            }`}
            onClick={() => handleTabClick(`/channel/${uid}/follow`)}
          >
            팔로잉 목록
          </p>
        </div>

        {children}
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
