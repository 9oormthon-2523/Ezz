"use client"
import { useHoverState, useVideoPlayerResize } from '@/app/_utils/live/local/useVideoPlayerHook'
import React, { ReactNode } from 'react'
import PlayerBottom from '../components/VideoPlayer/PlayerBottom/PlayerBottom.client' 
import PlayerHeader from '../components/VideoPlayer/PlayerHeader/PlayerHeader.client' 
import PlayerStateSign from '../components/VideoPlayer/ETC/PlayerStateSign.client'
import PlayerOverlay from '../components/VideoPlayer/ETC/PlayerOverlay.client' 
import OpacityAnimation from '@/app/_utils/live/local/useOpacityAnimation.client'
import useLiveControl from '@/app/_store/stores/live/useLiveControl'
import useLive from '@/app/_hooks/live/useLive'
import { useParams } from 'next/navigation'

// 스타일
import { 
  container_style, 
  videoControler_style, 
  frameVideoPlayer_style, 
  containerVideoPlayer_style 
} from '../style/VideoPlayerStyle'


/**
 * 라이브 비디오 플레이어 컴포넌트
 */
const VideoPlayer = () => {
  const { host_uid } = useParams<{ host_uid: string }>();
  const isChatOpen = useLiveControl(state => state.screen.state.isChatOpen);
  const isFullOrWide = useLiveControl(state => state.screen.state.isFullOrWide);
  const streaming_is_active = useLiveControl(state => state.streamRoom.state.is_active);
  
  // 라이브 스트리밍 훅
  const {
    videoElRef,
    audioElRef,
    canvasElRef,
    ratio:[h_rate, w_rate],
  } = useLive({ streaming_is_active, host_uid });

  //마우스 호버 훅
  const { isHover, HoverHandler } = useHoverState({});

  //리사이즈 훅
  const {videoFrameRef, videoTotalRef, wh} = useVideoPlayerResize({ w_rate });

  return (
    <div style={{ position: !isFullOrWide ? "relative" : undefined }}>

      <div 
        style={{ height:wh.h }} 
        className='absolute z-[0] w-screen bg-black'
      />

      <div 
        ref={videoTotalRef} 
        id='video-player-in-container'
        style={container_style(isFullOrWide)} 
        className="flex w-full overflow-hidden box-border"
      >
        
      <div 
        ref={videoFrameRef} 
        id="id='video-player-null-box" 
        className="w-full"
      />

      {/* 비디오 재생 프레임 */}
      <section
        aria-labelledby='video-player' 
        style={containerVideoPlayer_style(isFullOrWide, isChatOpen, wh)}
        className="absolute bg-black flex items-center justify-center box-border"
      >
        <h2 id='video-player-title' className='sr-only'>비디오 플레이어</h2>

        <div 
          id='video-player-container'
          style={frameVideoPlayer_style(isFullOrWide, wh, h_rate)} 
          className='max-w-[100vw]'
        >

          <audio 
            id='video-player-audio'
            ref={audioElRef}
          />

          <canvas 
            id='video-player-pause-img'
            ref={canvasElRef} 
            className='absolute' 
            style={frameVideoPlayer_style(isFullOrWide, wh, h_rate)} 
          />
            
          <video  
            id='video-player-player'
            aria-label="라이브 스트리밍 비디오 플레이어"
            ref={videoElRef}
            style={{objectFit:"scale-down"}} 
            muted 
            className='w-full h-full'
          />
                  
        </div>

      </section>
        
        {/* 비디오 플레이어 컨트롤러 */}
        <section 
          aria-labelledby='video-player-controller'
          style={videoControler_style(isFullOrWide, isChatOpen, wh)} 
          className="absolute max-h-[100vh]" onMouseMove={HoverHandler}
        > 
          <h2 id='video-player-controller-title' className='sr-only'>비디오 플레이어 컨트롤러</h2>

          {/* 호버 래핑 */}
          <HoverWrapper isHover={isHover}>
            {/* 비디오 상태 애니메이션 */}
            <PlayerStateSign/>
            
            {/* 오버레이 */}
            <PlayerOverlay/>

            {/* 비디오 헤더 및 버튼 */}
            <PlayerHeader/>

            {/* 비디오 컨트롤러 */}
            <PlayerBottom/>

          </HoverWrapper>
        </section>
      </div>
    </div>
  );
};

 
export default VideoPlayer;

//Opacity 래핑
const Wrapper = ({children}: {children:ReactNode}) => <div>{children}</div>;
const HoverWrapper = OpacityAnimation(Wrapper);