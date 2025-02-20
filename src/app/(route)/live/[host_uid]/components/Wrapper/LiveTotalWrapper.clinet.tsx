"use client";

import { CSSProperties, ReactNode } from "react";
import useNavToggle from "@/app/_store/main/useNavToggle.client";
import useLiveControl from "@/app/_store/stores/live/useLiveControl";

interface LiveWrapperProps {
  children?: ReactNode;
};

/**
 * streaming 페이지 전체 래퍼 컴포넌트
 */

const LiveTotalWrapper = ({ children }: LiveWrapperProps) => {
  const isFullOrWide = useLiveControl(state => state.screen.state.isFullOrWide);
  const chatPosition = useLiveControl(state => state.screen.state.chatPosition); 
  const isChatOpen = useLiveControl(state => state.screen.state.isChatOpen);
  const isNavOpen = useNavToggle(state => state.isOpen);
  const navPadding = isNavOpen ? 16 : 0; // 좌측 패딩

  // 컨테이너 스타일
  const containerStyle: CSSProperties = {
    position: isFullOrWide ? "fixed" : undefined,
    zIndex: isFullOrWide ? 20000 : undefined,
    width: isFullOrWide ? "100vw" : undefined,
    height: isFullOrWide ? "100vh" : undefined,
    left: isFullOrWide ? 0 : undefined,
    top: isFullOrWide ? 0 : undefined,
    backgroundColor: isFullOrWide ? "black" : undefined,
    minWidth: !isFullOrWide ? 840 : 440,
  }; 

  // 래퍼 스타일
  const wrapperStyle: CSSProperties = {
    flexDirection: chatPosition === "side" ? "row" : "column",
    height: isFullOrWide ? "100%" : "calc(100vh - 60px)", 
    justifyContent: !isChatOpen && isFullOrWide ? "center": undefined,
  };

  return (
    <div className="overflow-hidden relative pt-[60px]" style={{ paddingLeft: `${navPadding}rem` }}>
      <section
        id="vod-container"
        style={containerStyle}
        className="w-full overflow-hidden bg-[#f9f9f9]"
      >
        <div id="vod-wrapper" style={wrapperStyle} className="flex">
          {children}
        </div>
      </section>
    </div>
  );
};

export default LiveTotalWrapper;
