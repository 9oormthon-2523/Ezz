"use client"
import PlayerBottomVolumeControl from "./PlayerBottomVolume";
import { FullBtn, PlayPauseBtn, VolumeBtn, WideBtn } from "./PlayerButtons.client"
import React from "react";

/**
 * 비디오 플레이어 바텀
 * 비디오 플레이어를 조정 할 수 있는 기능들이 있습니다.
 */

const PlayerBottom  = () => {
    return (
        <div className="absolute right-[23px] left-[18px] bottom-[7px]">
            <div className="flex relative h-[36px] justify-between w-full">
                <div className="min-w-0 items-center flex left-0 relative">
                    <PlayPauseBtn/>
                    <VolumeBtn/>
                    <PlayerBottomVolumeControl/>
                </div>

                <div className="min-w-0 items-center flex left-0 relative">
                    <WideBtn/>
                    <FullBtn/>
                </div>

            </div>
        </div>
    );
};

export default React.memo(PlayerBottom);