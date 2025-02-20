'use client';

import React from 'react';
import { useUserStreaming } from '@/app/_store/queries/streamingSettings/query';
import { useUID } from '@/app/_store/context/useUid';
import { useStreamingWorker } from '@/app/_hooks/studio/worker/useStreamingWorker';

const StreamingStatus = () => {
  const uid = useUID();
  const { data } = useUserStreaming(uid);
  const { streamingStatus } = useStreamingWorker(uid);
  console.log(streamingStatus);

  return (
    <div className="absolute bottom-0 w-full bg-[#222] border border-[#FFFFFF1A] font-bold text-[14px] h-[40px] flex justify-center items-center text-white gap-[5px]">
      <div
        className="border-2	border-[#fff] rounded-full w-[12px] h-[12px] relative top-[1px]"
        style={{ backgroundColor: data?.is_active ? '#4CAF50' : '#ddd' }}
      />
      <span>{data?.is_active ? '온라인' : '오프라인'}</span>
    </div>
  );
};

export default StreamingStatus;
