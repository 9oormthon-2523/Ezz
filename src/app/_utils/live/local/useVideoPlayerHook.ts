import useNavToggle from "@/app/_store/main/useNavToggle.client";
import { useCallback, useEffect, useRef, useState } from "react";
import useChatPositionUpdater from "./useChatPositionUpdater";
import useLiveControl from "@/app/_store/stores/live/useLiveControl";

interface useVideoPlayerResizePayload {
    w_rate: number; //리사이즈 비율
};

// 리사이즈 이벤트 감지하여 비디오 비율 적용
export const useVideoPlayerResize = (payload: useVideoPlayerResizePayload) => {
    const { 
      w_rate,
    } = payload;

    const [wh, setWH] = useState({ w: 0, h: 0 });
    const videoFrameRef = useRef<HTMLDivElement|null>(null); // 비디오 재생 프레임
    const videoTotalRef = useRef<HTMLDivElement|null>(null); // 비디오 재생 컨트롤 프레임

    const isNavOpen = useNavToggle(state => state.isOpen);
    const isChatOpen = useLiveControl(state => state.screen.state.isChatOpen);
    const isFullscreen = useLiveControl(state => state.screen.state.isFullscreen);
    const chatPosition = useLiveControl(state => state.screen.state.chatPosition);
    const isWideScreen = useLiveControl(state => state.screen.state.isWidescreen);
    const { calculateChatPosition } = useChatPositionUpdater();

    //비디오 플레이어 창 핸들러
    const resizeHandler = useCallback(() => {
        if (!videoFrameRef.current) return;
        const height = videoFrameRef.current.clientWidth * w_rate;
        videoFrameRef.current.style.height = `${height}px`;
    
        if (!videoTotalRef.current) return;
        
        setWH({
          w: videoTotalRef.current.clientWidth,
          h: videoTotalRef.current.clientHeight,
        });
       
    },[w_rate]);

    // 채팅 위치 변경
    useEffect(()=>{
      calculateChatPosition(w_rate);
    },[w_rate, calculateChatPosition]);
      
    useEffect(() => {
      window.addEventListener("resize", resizeHandler);
      resizeHandler();
      return () => window.removeEventListener("resize", resizeHandler);
    }, [isChatOpen, isWideScreen, isFullscreen, chatPosition, isNavOpen, resizeHandler]);

    return { videoFrameRef, videoTotalRef, wh };
};



interface useHoverStatePayload {
    delay?:number;
};

// 마우스 움직임 감지시 3초 동안 비디오 컨트롤러 visible
export const useHoverState = (payload: useHoverStatePayload) => {
    const { delay = 3000 } = payload;
    const [isHover, setIsHover] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const volumeLevel = useLiveControl((state) => state.audioTrack.state.volumeLevel);
  
    //3초 동안 Hover가 안꺼짐
    const HoverHandler = useCallback(() => {
      setIsHover(true);
      if (timerRef.current) clearTimeout(timerRef.current);
  
      timerRef.current = setTimeout(() => {
        setIsHover(false);
      }, delay);
    }, [delay]);

    // 마우스 이동 감지 + 의존성
    useEffect(()=>{
        HoverHandler();
        return () => {
          if (timerRef.current) clearTimeout(timerRef.current);
        }
    },[volumeLevel, HoverHandler]);

    return { isHover, HoverHandler };
};