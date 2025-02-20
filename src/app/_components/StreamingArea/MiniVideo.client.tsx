'use client';

import { useEffect, useRef, useState } from 'react';
import type * as AgoraRTCType from 'agora-rtc-sdk-ng';

interface Props {
  is_active: boolean;
  videoTrackRef:React.RefObject<AgoraRTCType.ILocalVideoTrack | null>;
};

// 미디어 트랙이 있으면 이를 할당한 videoElRef 반환
const useVideoRef = ({ is_active, videoTrackRef }: Props) => {
  const videoElRef = useRef<HTMLVideoElement>(null);
  const limit = useRef<boolean>(false);
  const SEC = 2 * 1000;

  // 2초 단위로 미디어 스트림 확인
  useEffect(() => {
    if (!is_active) {
      if(videoElRef.current) 
        videoElRef.current.srcObject = null; // 비디오 src 초기화
      return;
    }

    const interval = setInterval(() => {
      if (!videoTrackRef.current || !videoElRef.current) {
        limit.current = false;
        return
      };

      // 미디어 스트림이 존재하면 videoElRef에 src할당
      
      videoTrackRef.current.play(videoElRef.current);
      limit.current = true;
      
    }, SEC);

    return () => clearInterval(interval);
  },[is_active, videoTrackRef, videoElRef, SEC]);

  return {
    videoElRef,
  }
};


const MiniVideo = ({ is_active, videoTrackRef }: Props) => {
  const [isHidden, setIsHidden] = useState(false);
  const { videoElRef } = useVideoRef({ is_active, videoTrackRef });

  return (
    <>
      <div
        className={`fixed z-30 bottom-0 right-0 w-[40%] aspect-video bg-slat flex justify-center items-center bg-black bg-opacity-70
        transition-all duration-500 ease-in-out 
        ${isHidden ? 'translate-x-[150%] translate-y-[150%] scale-0 opacity-0' : 'translate-x-0 translate-y-0 scale-100 opacity-100'}`}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={() => setIsHidden(true)}
          className="absolute -top-3 -left-3 px-2.5 py-1 bg-blue-500 rounded-full text-white text-sm font-extrabold hadow-md "
        >
          X
        </button>
        
        <video muted ref={videoElRef} className="w-[90%] h-[90%] bg-black"></video>
      </div>

      {/* 다시 보기 버튼 */}
      {isHidden && (
        <button
          onClick={() => setIsHidden(false)}
          className="z-30 fixed bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md font-extrabold"
        >
          비디오 다시 보기
        </button>
      )}
    </>
  );
};

export default MiniVideo;
