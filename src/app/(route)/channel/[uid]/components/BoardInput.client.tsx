'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/app/_utils/supabase/client';
import Image from 'next/image';

const BoardInput = () => {
  const router = useRouter();
  const { uid } = useParams();
  const defaultImage = '/channelPage/blank_profile.svg';
  const [profileImg, setProfileImg] = useState<string | null>(null);

  const fetchProfileImage = async () => {
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error('사용자 정보 불러오기 오류:', userError.message);
      return;
    }

    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('profile_img')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('프로필 이미지 불러오기 오류:', error.message);
      } else {
        setProfileImg(data?.profile_img || null);
      }
    }
  };

  useEffect(() => {
    fetchProfileImage();
  }, []);

  const useHandleClick = () => {
    if (uid) {
      router.push(`/channel/${uid}/write`); 
    }
  };

  return (
    <div
      className="flex h-16 mt-4 w-full bg-gray-200 hover:bg-gray-300 rounded-2xl items-center font-semibold text-gray-500 pl-4 cursor-pointer"
      onClick={useHandleClick}
    >
      <div className="flex flex-col flex-shrink-0 w-10 h-10 rounded-full bg-white shadow-md text-sm mr-2 relative">
        <Image
          src={profileImg || defaultImage}
          alt="프로필 이미지"
          layout="fill"
          objectFit="cover" 
          className="rounded-full"
        />
      </div>      
      어떤 이야기를 남길건가요?
    </div>
  );
};

export default BoardInput;
