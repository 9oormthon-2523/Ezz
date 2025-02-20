"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams, useSelectedLayoutSegment } from 'next/navigation';
import Header from "@/app/_components/Header/Header.server";
import NavBar from "@/app/(route)/(main)/_components/NavBar/NavBar.client";
import useNavToggle from "@/app/_store/main/useNavToggle.client";
import { createClient } from "../../../_utils/supabase/client";
import ChannelProfile from "@/app/(route)/channel/[uid]/components/ChannelProfile";
import Footer from '@/app/_components/Footer/footer';
import { useFollowAction } from '@/app/_store/queries/follow/mutation';

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  const { isOpen } = useNavToggle();
  const [isClient, setIsClient] = useState(false); 
  const [userInfo, setUserInfo] = useState<{ nickname: string; channel_intro: string; img_url: string } | null>(null);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

  const { uid } = useParams(); 
  const router = useRouter();
  const activeSegment = useSelectedLayoutSegment();
  const isCommunityActive = !activeSegment || ['post', 'comment', 'detail', 'edit'].includes(activeSegment || '');

  const supabase = createClient();
  const { followMutate, unfollowMutate } = useFollowAction();

  const fetchUserInfo = async () => {
    if (!uid) return; 
    const { data, error } = await supabase
      .from("users")
      .select("nickname, channel_intro, profile_img")
      .eq("id", uid)
      .single();

    if (error) {
      console.error("사용자 정보 불러오기 오류", error);
    } else {
      setUserInfo({
        nickname: data.nickname,
        channel_intro: data.channel_intro,
        img_url: data.profile_img || "",
      });
    }
  };

  const fetchLoggedInUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error('로그인된 사용자 정보 가져오기 오류', error);
    } else {
      setLoggedInUserId(user?.id || null);
    }
  };

  const fetchFollowerData = async () => {
    if (!uid) return;
    try {
      const { count, error: countError } = await supabase
        .from('follows')
        .select('*', { count: 'exact' })
        .eq('following_id', uid);

      if (countError) {
        throw new Error('팔로워 수 가져오기 오류: ' + countError.message);
      }
      setFollowerCount(count || 0);

      if (loggedInUserId) {
        const { data: followData, error: followError } = await supabase
          .from('follows')
          .select('*')
          .eq('follower_id', loggedInUserId)
          .eq('following_id', uid)
          .single();

        if (followError && followError.code !== 'PGRST116') {
          throw new Error('팔로우 상태 확인 오류: ' + followError.message);
        }
        setIsFollowing(!!followData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && uid) {
      fetchUserInfo(); 
    }
  }, [isClient, uid]);

  useEffect(() => {
    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    if (uid) {
      fetchFollowerData();
    }
  }, [uid, loggedInUserId]);

  const handleTabClick = (path: string) => {
    router.push(path);
  };

  const handleChannelStudioClick = () => {
    if (uid) router.push(`/studio/${uid}`);
  };

  const handleChannelManagementClick = () => {
    if (uid) router.push(`/channel/${uid}/settings`);
  };

  const handleFollow = () => {
    if (!uid) return;
    followMutate(
      { uid: Array.isArray(uid) ? uid[0] : uid, nickname: userInfo?.nickname || '' },
      {
        onSuccess: () => {
          setIsFollowing(true);
          setFollowerCount((prev) => prev + 1);
        },
        onError: (error) => {
          console.error('팔로우 오류:', error);
        },
      }
    );
  };

  const handleUnfollow = () => {
    if (!uid) return;
    unfollowMutate(
      { uid: Array.isArray(uid) ? uid[0] : uid, nickname: userInfo?.nickname || '' }, 
      {
        onSuccess: () => {
          setIsFollowing(false);
          setFollowerCount((prev) => Math.max(prev - 1, 0));
        },
        onError: (error) => {
          console.error('언팔로우 오류:', error);
        },
      }
    );
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
              isCommunityActive ? 'text-black border-b-4 border-black' : 'text-gray-400'
            }`}
            onClick={() => handleTabClick(`/channel/${uid}`)}
          >
            커뮤니티
          </p>
          <p
            className={`text-xl font-black ml-4 mt-6 p-2 cursor-pointer ${
              activeSegment === 'follow' ? 'text-black border-b-4 border-black' : 'text-gray-400'
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
