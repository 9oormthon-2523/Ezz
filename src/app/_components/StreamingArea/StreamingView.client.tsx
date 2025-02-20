'use client';

import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import StreamingStatus from './StreamingStatus.client';
import { useUserStreaming } from '@/app/_store/queries/streamingSettings/query';
import { useUID } from '@/app/_store/context/useUid';
import ExplainBtn from './ExplainBtn.client';
import ChatLayout from '@/app/(route)/live/[host_uid]/widget/Chat.client';

import type * as AgoraRTCType from 'agora-rtc-sdk-ng';

const StreamingButtonList = dynamic(() => import('./StreamingButtonList.client'), {
  ssr: false,
});

const BeforeUnloadWrapper = dynamic(() => import('./BeforeUnloadWrapper.client'), {
  ssr: false,
});

const MiniVideo = dynamic(() => import('./MiniVideo.client'), {
  ssr: false,
});

const StreamingView = () => {
  const uid = useUID();
  const { data } = useUserStreaming(uid);
  const videoTrackRef = useRef<null | AgoraRTCType.ILocalVideoTrack>(null);

  return (
    <BeforeUnloadWrapper>
      <div className="relative flex flex-col justify-center items-center  bg-gray-200 bg-[url('https://ssl.pstatic.net/static/nng/glive-center/resource/p/static/media/player_loading_chzzk.784104a77733493ed42f.gif')] bg-cover bg-center w-[50%] h-[90%]">
        {/* 사용 설명서 모달 버튼 */}
        <ExplainBtn />

        <p className="text-white font-medium">방송 시작 및 종료는 해당 페이지에서 가능합니다.</p>
        <p className="text-white font-bold">스트리밍을 시작하기 전에 우측 상단의 사용 설명서를 꼭! 읽어주세요.</p>

        {/* 스트리밍 버튼 툴 */}
        <div className="mt-[30px]">
          <StreamingButtonList videoTrackRef={videoTrackRef}/>
        </div>

        {/* 현재 스트리밍 상태 */}
        <StreamingStatus />

        {/* 공유중인 비디오 */}
        <MiniVideo videoTrackRef={videoTrackRef} is_active={data?.is_active || false} />
      </div>

      {/* 채팅 레아아웃 */}
      <ChatLayout roomId={uid} client_uid={uid} />
    </BeforeUnloadWrapper>
  );
};

export default StreamingView;
