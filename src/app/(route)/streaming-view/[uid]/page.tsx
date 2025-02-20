import React from 'react';
import { prefetchUserStreaming } from '@/app/_store/queries/streamingSettings/query';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import StreamingView from '../../../_components/StreamingArea/StreamingView.client';
import '@/app/_styles/customChat.css';

const StreamingViewPage = async ({ params }: { params: Promise<{ uid: string }> }) => {
  const { uid } = await params;
  const { queryClient } = await prefetchUserStreaming(uid);

  return (
    <div className="flex w-full h-full">
      <div className="flex justify-center items-center w-full h-full">
        <HydrationBoundary state={dehydrate(queryClient)}>
          {/* 스트리밍 화면 영역 */}
          <StreamingView />
        </HydrationBoundary>
      </div>
    </div>
  );
};

export default StreamingViewPage;
