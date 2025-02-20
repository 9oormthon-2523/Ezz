import React from 'react';
import dynamic from 'next/dynamic';
import { StreamCardType } from '@/app/_types/streamcard/streamcard.type';
import StreamCardSkeleton from './skeletonUI/StreamCardSkeleton';

const StreamCard = dynamic(() => import('@/app/_components/StreamList/streamCard/StreamCard.server'), {
  ssr: true,
  loading: () => <StreamCardSkeleton />,
});

interface StreamListProps {
  streamData: StreamCardType[];
}

const StreamList: React.FC<StreamListProps> = ({ streamData }) => {
  return (
    <div className="px-4">
      {streamData.length > 0 ? (
        <div className="grid grid-cols-[repeat(4,minmax(330px,1fr))] justify-items-center">
          {streamData.map((data: StreamCardType) => (
            <StreamCard key={data.uid} {...data} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">현재 진행 중인 방송이 없습니다.</p>
      )}
    </div>
  );
};

export default StreamList;
