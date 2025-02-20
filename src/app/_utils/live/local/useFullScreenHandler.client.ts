import useLiveControl from "@/app/_store/stores/live/useLiveControl";
import { useEffect } from "react";

/**
 * 전체 화면 핸들러
 */

const useFullscreenHandler = () => {
  const isFullscreen = useLiveControl(state => state.screen.state.isFullscreen);
  const offFullScreen = useLiveControl(state => state.screen.actions.offFullScreen);
  
  // 풀 스크린 상태가 해제 되면 풀 스크린 상태 false로 변환
  useEffect(() => {
    const clearFullScreenDetect = () => {
      if (!document.fullscreenElement) offFullScreen();
    };

    document.addEventListener("fullscreenchange", clearFullScreenDetect);
    return () => {
      document.removeEventListener("fullscreenchange", clearFullScreenDetect);
    };
  }, [offFullScreen]);

  // 풀 스크린 상태가 true면 풀 스크린 실행
  useEffect(() => {
    const handleFullscreenToggle = async () => {
      try {
        if (!isFullscreen && document.fullscreenElement) {
          await document.exitFullscreen();
        } else if (isFullscreen) {
          await document.body.requestFullscreen();
        }
      } catch (err) {
        console.error("Error fullscreen:", err);
      }
    };
    handleFullscreenToggle();
  }, [isFullscreen]);
}

export default useFullscreenHandler;