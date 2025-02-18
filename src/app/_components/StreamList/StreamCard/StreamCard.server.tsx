import React from 'react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import Image from 'next/image';
import { StreamCardType } from '@/app/_types/streamcard/streamcard.type';

const StreamCard = (card: StreamCardType) => {
  const { title, nickname, audience_cnt, uid, thumbnail, is_active, profile_img, tags } = card;
  const router = useRouter();
  const defaultImage = '/channelPage/blank_profile.svg';

  const moveToLivePage = useCallback(() => {
    router.push(`/live/${uid}`);
  }, [router, uid]);
  const moveToProfile = useCallback(() => {
    router.push(`/channel/${uid}`);
  }, [router, uid]);
  return (
    <div className="hover:cursor-pointer bg-white rounded-lg p-2 min-w-[320px]  min-h-[300px]">
      {/* 이미지 */}

      <div className="relative h-44 rounded-lg border border-gray-200 hover:cursor-pointer" onClick={moveToLivePage}>
        {/* 이미지 배경 */}
        <div className="absolute inset-0 rounded-lg overflow-hidden flex justify-center items-center">
          <Image
            src={thumbnail || '/mainPage/thumbnailImg.webp'}
            alt="썸네일 이미지"
            layout="intrinsic"
            width={200}
            height={180}
            objectFit="cover"
            priority
            fetchPriority="high"
          />
        </div>

        {/* 오버레이 레이어 추가 */}
        <div className="absolute inset-0 bg-black opacity-0 hover:opacity-25 transition-opacity rounded-lg"></div>

        {is_active && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">LIVE</div>
        )}

        <div className="absolute top-2 right-2 bg-black text-white text-xs font-semibold px-2 py-1 rounded">
          {audience_cnt.toLocaleString()}명
        </div>
      </div>

      <div className="p-2">
        <h2 className="text-sm font-semibold line-clamp-1" onClick={moveToLivePage}>
          {title}
        </h2>
        {/* 프로필 */}
        <span className="inline-flex items-center gap-1 mt-1" onClick={moveToProfile}>
          <div className="relative w-6 h-6 rounded-full overflow-hidden border border-gray-300">
            <Image
              src={profile_img || defaultImage}
              alt={`${nickname} profile`}
              layout="intrinsic"
              width={24}
              height={24}
              objectFit="cover"
              className="rounded-full"
              loading="lazy"
            />
          </div>
          <span className="text-xs text-gray-700 font-medium">{nickname}</span>
        </span>

        <div className="flex flex-wrap gap-1 mt-2">
          {tags.length > 0 &&
            tags.map((tag, index) => (
              <span key={index} className="bg-gray-200 text-xs text-gray-600 px-2 py-1 rounded-md ">
                {tag}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default StreamCard;
