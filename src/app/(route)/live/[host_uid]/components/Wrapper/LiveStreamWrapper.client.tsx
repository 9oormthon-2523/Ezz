"use client"
import Footer from "@/app/_components/Footer/footer";
import React, { CSSProperties, ReactNode, useRef } from "react";
import useLiveControl from "@/app/_store/stores/live/useLiveControl";

interface LiveStreamWrapperProps {
    children?: ReactNode;
};

/**
 * 라이브 스트리밍 래퍼 컴포넌트
 * 채팅 포지션과 (좌단/하단) 스크린 상태에 따라 flex 변경
 */

const LiveStreamWrapper = (props:LiveStreamWrapperProps) => {
    const { children } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const isFullOrWide = useLiveControl(state => state.screen.state.isFullOrWide);
    const chatPosition = useLiveControl(state => state.screen.state.chatPosition);


    // flex로 페이지 분리함
    const main_style: CSSProperties = {
        scrollbarWidth:'none', 
        flex: chatPosition === "side" ? "1 1 0%" : undefined,
        justifyContent: isFullOrWide ? "center" : undefined,
    };

    const container_style: CSSProperties = {
        maxHeight: !isFullOrWide ? "100%" : undefined
    }

    return (
        <main 
            id="view-steaming" 
            ref={containerRef}
            style={main_style}  
            className="flex flex-col min-w-[0] overflow-y-auto"
        >
            <div style={container_style} id="live-information-container" className="flex flex-col">
                { children }
            </div>

            {/* 광고란 */}    
            {!isFullOrWide &&<div id="live-banner-container" className=""></div>}

            {/* footer 정보란... */}
            {!isFullOrWide && (
                <Footer/>
            )}

        </main>
    );
};

export default LiveStreamWrapper;