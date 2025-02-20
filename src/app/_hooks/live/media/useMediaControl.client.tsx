import { IRemoteVideoTrack, IRemoteAudioTrack } from "agora-rtc-sdk-ng";
import useLiveControl from "@/app/_store/stores/live/useLiveControl";
import { RefObject, useCallback, useEffect, useRef } from "react";


interface useMeidaControl_payload {
    audiolimit:RefObject<boolean>;
    videoElRef: RefObject<HTMLVideoElement | null>;
    canvasElRef: RefObject<HTMLCanvasElement | null>;
    audioTrackRef: RefObject<IRemoteAudioTrack | null>;
    videoTrackRef: RefObject<IRemoteVideoTrack | null>;
}

const useMediaControl = (payload:useMeidaControl_payload) => {
    const {
        audiolimit,
        videoElRef,
        canvasElRef,
        audioTrackRef,
        videoTrackRef,
    } = payload;
    
    // Volume Control
    const isMuted = useLiveControl(state => state.audioTrack.state.isMuted);
    const videoState = useLiveControl(state => state.videoTrack.state.isEnabled);
    const volumeLevel = useLiveControl(state => state.audioTrack.state.volumeLevel);
    const audioMute = useLiveControl(state => state.audioTrack.actions.audioMute);

    // 초기값 리밋
    const didInit = useRef(false);


    /** 미디어 제어 함수 **/
    //#region 

    // 캔버스 캡처(정지화면 활성화화)
    const PauseCanvasCapture = useCallback(()=>{
        if (canvasElRef.current && videoTrackRef.current && videoElRef.current) {
            
            if(!videoTrackRef.current.isPlaying) return;
            canvasElRef.current.style.opacity = "1";
            const canvas = canvasElRef.current;
            const ctx = canvas.getContext("2d");
        
            const ratio = 1.2; 
            const w = canvas.width * ratio; 
            const h = canvas.height * ratio; 
            
            canvas.width = w;
            canvas.height = h;
    
            ctx?.scale(ratio, ratio);
            ctx?.drawImage(videoElRef.current, 0, 0, canvas.width / ratio, canvas.height / ratio);
        }
    },[canvasElRef, videoElRef, videoTrackRef]);

    // 정지화면 비활성화
    const EraseCanvas = useCallback(() => {
        if (canvasElRef.current) canvasElRef.current.style.opacity = "0";
    },[canvasElRef]);


    // 비디오 제어
    const PauseVideo = useCallback(() => {
        videoTrackRef.current?.stop();
    },[videoTrackRef]);

    const PlayVideo = useCallback(() => {
        if(videoTrackRef.current && videoElRef.current) 
            if(!videoTrackRef.current.isPlaying)
                videoTrackRef.current.play(videoElRef.current);
    },[videoElRef, videoTrackRef]);


    // 오디오 제어
    const PlayAudio = useCallback(() => {
        if (audioTrackRef.current && !audioTrackRef.current.isPlaying) {
            audioTrackRef.current.play();

            // 정책 해제 
            if (!audiolimit.current) 
                audiolimit.current = true;
        }

    },[audioTrackRef, audiolimit]);

    const StopAudio = useCallback(() => {
        audioTrackRef.current?.stop()
    },[audioTrackRef]);

    const SetVolume = useCallback(() => {
        audioTrackRef.current?.setVolume(volumeLevel)
    },[audioTrackRef, volumeLevel]);

    //#endregion 


    /** useEffect **/
    //#region 

    // 오디오 초기 mute 세팅 (브라우저 정책 우회 위함)
    useEffect(() => {
        if (didInit.current) return; 
        didInit.current = true; 

        audioMute(true); 
    }, [audioMute]);


    // 볼륨 제어
    useEffect(()=>{
        SetVolume();
    },[SetVolume]);
    

    // 뮤트 제어
    useEffect(()=>{
        if (!audioTrackRef.current) return;
        const AudioState = isMuted ? "muted" : "unmuted";
        
        if (AudioState === "muted") {
            StopAudio();
        } else if (AudioState === "unmuted") {
            PlayAudio();
        }
    },[isMuted, audioTrackRef, PlayAudio, StopAudio]);


    // 비디오 제어 
    useEffect(() => {
       if (!videoTrackRef.current) return;
       const VideoState = videoState ? "play" : "pause";

       if (VideoState === "pause") {
            PauseCanvasCapture();
            PauseVideo();
       } else if (VideoState === "play") {
            EraseCanvas();
            PlayVideo();
       }
    },[videoState, videoTrackRef, PlayVideo, PauseVideo, PauseCanvasCapture, EraseCanvas]);
    
    //#endregion 
    
    return {
        EraseCanvas,
    };
};

export default useMediaControl;