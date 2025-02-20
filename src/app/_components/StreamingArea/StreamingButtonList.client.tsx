'use client';

import useStudioManager from '@/app/_hooks/studio/useStudioManager.client';
import { useUID } from '@/app/_store/context/useUid';
import { useUserStreaming } from '@/app/_store/queries/streamingSettings/query';
import React, { useState } from 'react';
import ActionButton from './ActionButton.client';
import { useStreamingWorker } from '@/app/_hooks/studio/worker/useStreamingWorker';
import type * as AgoraRTCType from 'agora-rtc-sdk-ng';

interface Props {
  videoTrackRef:React.RefObject<AgoraRTCType.ILocalVideoTrack | null>;
};

const StreamingButtonList = ({ videoTrackRef }: Props) => {
  const uid = useUID();
  const { streamOn, streamOff, addTrackShare, stopTrackShare, volumeControl, screenTrackRef } = useStudioManager(uid);
  const { audioState, controlAudio, audioVolume } = volumeControl;
  const { data, isLoading } = useUserStreaming(uid);
  const [loadingStatus, setLoadingStatus] = useState({
    streaming: false,
    mic: false,
    screen: false,
  });
  const { sendMessage } = useStreamingWorker(uid);

  // db 데이터 안불러와졌을때
  if (isLoading || !data) {
    return null;
  }

  // 스트리밍이 종료된 상태일때
  if (!data.is_active) {
    return (
      <ActionButton
        action={async () => {
          await streamOn();
          sendMessage('streamOn');
        }}
        text="스트리밍 시작하기"
      />
    );
  }

  videoTrackRef.current = screenTrackRef.current;

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex gap-2">
        <ActionButton
          action={async () => {
            await streamOff();
            sendMessage('streamOff');
          }}
          text="스트리밍 종료"
        />
        <ActionButton
          action={async () => {
            try {
              setLoadingStatus((prev) => ({
                ...prev,
                screen: true,
                mic: true,
              }));
              await stopTrackShare();
            } finally {
              setLoadingStatus((prev) => ({
                ...prev,
                screen: false,
                mic: false,
              }));
              alert('스트리밍이 정지되었습니다. 공유된 비디오와 마이크 연결이 끊어집니다.');
            }
          }}
          text="스트리밍 정지"
        />
        <ActionButton
          action={async () => {
            try {
              setLoadingStatus((prev) => ({ ...prev, mic: true }));
              await addTrackShare('mic');
            } finally {
              setLoadingStatus((prev) => ({ ...prev, mic: false }));
            }
          }}
          text="마이크만 키기"
        />
        <ActionButton
          action={async () => {
            try {
              setLoadingStatus((prev) => ({ ...prev, screen: true }));
              await addTrackShare();
            } finally {
              setLoadingStatus((prev) => ({ ...prev, screen: false }));
            }
          }}
          text="화면 공유 변경"
        />
      </div>

      {(loadingStatus.mic || loadingStatus.screen) && (
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      )}

      {!loadingStatus.mic && audioState('mic').isActive && (
        <div className="flex flex-col items-center w-[300px] rounded-2xl bg-white text-[#697183] text-[15px] font-blackHanSans py-[5px] px-[15px] ">
          <span>마이크 음량 조절</span>
          <input
            type="range"
            step={1}
            min={0}
            max={100}
            value={audioVolume.mic}
            onChange={(e) => controlAudio('mic', Number(e.currentTarget.value))}
            className="w-full"
          />
        </div>
      )}

      {!loadingStatus.screen && audioState('screen').isActive && (
        <div className="flex flex-col items-center w-[300px] rounded-2xl bg-white text-[#697183] text-[15px] font-blackHanSans py-[5px] px-[15px] ">
          <span>화면 공유 음량 조절</span>
          <input
            type="range"
            step={1}
            min={0}
            max={100}
            value={audioVolume.screen}
            onChange={(e) => controlAudio('screen', Number(e.currentTarget.value))}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default StreamingButtonList;
