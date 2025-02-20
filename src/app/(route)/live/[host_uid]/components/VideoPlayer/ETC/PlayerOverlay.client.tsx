"use client"
import useLiveControl from "@/app/_store/stores/live/useLiveControl";
import React from "react";

/**
 * 비디오 오버레이 컴포넌트 
 * 스타일 용 
 */

const PlayerOverlay = () => {
    const PERCENT = 15;
    const BGCOLOR = "#1c1c1c";
    
    const style = { 
        background: `linear-gradient(180deg, ${BGCOLOR} 0%, rgba(0, 0, 0, 0) ${PERCENT}%, rgba(0, 0, 0, 0) ${100 - PERCENT}%, ${BGCOLOR} 100%)`
    };

    const videoToggle = useLiveControl(state => state.videoTrack.actions.videoToggle);

    return (
        <div 
            id='video-player-controller-overlay'
            onClick={videoToggle} 
            style={style} 
            className={`absolute w-full h-full`}
        />
    );
    
};

//리사이즈 될 때마다 불필요하게 렌더링 되서 memo사용
export default React.memo(PlayerOverlay);
