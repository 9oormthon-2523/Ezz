"use client"
import PlayerBottomButton from "./PlayerBottomButton.client";
import useLiveControl from "@/app/_store/stores/live/useLiveControl";

// 와이드
export const WideBtn = () => {
    const toggleWideScreen = useLiveControl(state => state.screen.actions.toggleWideScreen);
    const isFullscreen = useLiveControl(state => state.screen.state.isFullscreen);

    return (
        <>
            {!isFullscreen &&
                <PlayerBottomButton 
                    info="와이드 모드" 
                    onClick={toggleWideScreen} 
                    svgName="VideoWidescreen" 
                    aria-label="toggle-wide-screen-mode" 
                />
            }
        </>
    )
}

// 풀 스크린
export const FullBtn = () => {
    const toggleFullscreen = useLiveControl(state => state.screen.actions.toggleFullscreen);

    return (
        <PlayerBottomButton 
            info="전체 화면" 
            onClick={toggleFullscreen} 
            svgName="VideoFullscreen" 
            style="pl-[2.2px] pt-[2.2px]"
            aria-label="toggle-full-screen-mode" 
        />
    )
}

// 정지,재생
export const PlayPauseBtn = ()=> {
    const isEnabled = useLiveControl(state => state.videoTrack.state.isEnabled);
    const videoToggle = useLiveControl(state => state.videoTrack.actions.videoToggle);

    return (
        <PlayerBottomButton 
            info={isEnabled ? "정지" : "재생"} 
            svgName={`${isEnabled ? "VideoPause" : "VideoPlay"}`}
            onClick={videoToggle}
            aria-label="toggle-video-play-pause" 
        />
    )
}

// 볼륨
export const VolumeBtn = () => {
    const volumeLevel = useLiveControl(state => state.audioTrack.state.volumeLevel);
    const isMuted = useLiveControl(state => state.audioTrack.state.isMuted);
    const videoState = useLiveControl(state => state.videoTrack.state.isEnabled);
    const audioMute = useLiveControl(state => state.audioTrack.actions.audioMute);

    //svg 추출
    const getVolumeIcon = () => {
        const volume = volumeLevel;
      
        if (isMuted === true) return "VideoVolume0"; 
        if (50 < volume) return "VideoVolume100";
        if (1 < volume) return "VideoVolume50";
      
        return "VideoVolume0";
      };

    const volumeMute = () => {
        if(videoState)
            audioMute(!isMuted);
    }
    
    return (
        <PlayerBottomButton info="볼륨 조절" svgName={getVolumeIcon()} style="mb-4 scale-[90%]" onClick={volumeMute}/>
    )
}

