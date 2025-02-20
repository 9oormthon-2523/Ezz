'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/app/_utils/supabase/client';
import { useFollowAction } from '@/app/_store/queries/follow/mutation';
import { useLoggedInUser } from '@/app/_hooks/channel/useLoggedInUser';

interface UserInfo {
  nickname: string;
  channel_intro: string;
  img_url: string;
}

const useChannelData = (uid: string) => {
  const supabase = createClient();
  const { followMutate, unfollowMutate } = useFollowAction();

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const loggedInUserId = useLoggedInUser();
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!uid) return;
      const { data, error } = await supabase
        .from('users')
        .select('nickname, channel_intro, profile_img')
        .eq('id', uid)
        .single();

      if (error) {
        console.error('사용자 정보 불러오기 오류', error);
      } else {
        setUserInfo({
          nickname: data.nickname,
          channel_intro: data.channel_intro,
          img_url: data.profile_img || '',
        });
      }
    };
    fetchUserInfo();
  }, [uid, supabase]);

  // 팔로우 상태 가져오기
  useEffect(() => {
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
    fetchFollowerData();
  }, [uid, loggedInUserId, supabase]);

  // 팔로우
  const handleFollow = () => {
    if (!uid) return;
    followMutate(
      { uid, nickname: userInfo?.nickname || '' },
      {
        onSuccess: () => {
          setIsFollowing(true);
          setFollowerCount((prev) => prev + 1);
        },
        onError: (error) => {
          console.error('팔로우 오류:', error);
        },
      },
    );
  };

  // 언팔로우
  const handleUnfollow = () => {
    if (!uid) return;
    unfollowMutate(
      { uid, nickname: userInfo?.nickname || '' },
      {
        onSuccess: () => {
          setIsFollowing(false);
          setFollowerCount((prev) => Math.max(prev - 1, 0));
        },
        onError: (error) => {
          console.error('언팔로우 오류:', error);
        },
      },
    );
  };

  return {
    userInfo,
    loggedInUserId,
    followerCount,
    isFollowing,
    handleFollow,
    handleUnfollow,
  };
};

export default useChannelData;
