"use client"
import useLiveControl from "@/app/_store/stores/live/useLiveControl";

//볼륨 조절 버튼
const PlayerBottomVolumeControl = () => {
    const audioMute = useLiveControl(state => state.audioTrack.actions.audioMute);
    const volumeControl = useLiveControl(state => state.audioTrack.actions.volumeControl);
    const isMuted = useLiveControl(state => state.audioTrack.state.isMuted);
    const volumeLevel = useLiveControl(state => state.audioTrack.state.volumeLevel);
    const videoState =  useLiveControl(state => state.videoTrack.state.isEnabled);
    
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (videoState && isMuted) audioMute(false);
        volumeControl(Number(e.target.value));  
    };

    return (
        <div className="flex i tems-center justify-center w-[84px]">
            <label htmlFor="volume-range" className="sr-only">볼륨 조절</label>
            <input
                type="range" 
                aria-label="볼륨 조절"
                id="volume-range"
                min={0} 
                max={100}
                step={0.1}
                value={isMuted ? 0 : volumeLevel}
                onChange={handleVolumeChange} //볼륨 조절
                onMouseMove={e => {e.stopPropagation();}} // 이벤트 버블링을 막음 (부모 요소의 move이벤트에 덧 씌워져 슬라이딩이 막힘)
                className="w-full h-[2.3px] mt-[1px] bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-500 "
                style={{ background: `linear-gradient(to right, #527cdc ${Number(isMuted ? 0 : volumeLevel)}%, #e5e5e5 ${Number(isMuted ? 0 : volumeLevel)}%)`}}
            />
        </div>
    );
};

export default PlayerBottomVolumeControl;