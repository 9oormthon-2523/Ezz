import { IRemoteVideoTrack, IRemoteAudioTrack } from "agora-rtc-sdk-ng";
import useLiveControl from "@/app/_store/stores/live/useLiveControl";
import type * as AgoraRTCType from "agora-rtc-sdk-ng";
import { RefObject } from "react";

type mediaType = "audio" | "video" | "datachannel"

interface useMediaPublish_payload {
    audiolimit: RefObject<boolean>,
    hostUIDRef: RefObject<string | null>,
    audioElRef : RefObject<null | HTMLAudioElement>;
    videoElRef : RefObject<null | HTMLVideoElement>;
    audioTrackRef : RefObject<null | IRemoteAudioTrack>;
    videoTrackRef : RefObject<null | IRemoteVideoTrack>;
    updateRatio: (a: number, b: number) => void;
}

// 미디어 퍼블리싱 훅
const useMediaPublish = (payload : useMediaPublish_payload) => {
    // Agora에서 주는 uid는 숫자열로 바꿔서 주기에 별도로 필요했음

    const {
        audiolimit,
        hostUIDRef,
        audioElRef,
        videoElRef,
        audioTrackRef,
        videoTrackRef,
        updateRatio,
    } = payload;

    // Volume Control
    const audioMute = useLiveControl(state => state.audioTrack.actions.audioMute);
    const volumeLevel = useLiveControl(state => state.audioTrack.state.volumeLevel);

    /** 리소스 클린업 **/
    //#region    

    // 비디오 리소스 클리어
    const cleanVideoTrack = async () => {
        if (videoTrackRef.current && videoElRef.current) {
            const mediaStream = videoElRef.current.srcObject as MediaStream;
            if(mediaStream) {
                const tracks = mediaStream.getTracks();
                tracks.forEach((track) => {
                    track.stop();
                });
            }

            videoTrackRef.current.stop();
            videoElRef.current.pause();   
            videoElRef.current.srcObject = null;
            videoTrackRef.current = null;
            console.log("비디오 트랙 정리 완료");
        }
    };

    // 오디오 리소스 클리어
    const cleanAudioTrack = async () => {
        if (audioTrackRef.current && audioElRef.current) {
            const mediaStream = audioElRef.current.srcObject as MediaStream;
            if(mediaStream) {
                const tracks = mediaStream.getTracks();
                tracks.forEach((track) => {
                    track.stop();
                });
            }
            
            audioElRef.current.pause();
            audioTrackRef.current.stop();
            audioTrackRef.current = null;
            audioElRef.current.srcObject = null; 

            console.log("오디오 트랙 정리 완료");
        }
    };

    //#endregion


    /** 미디어 구독 관리 **/
    //#region

    
    // 호스트 채널의 미디어 공유에 대한 구독을 취소합니다.
    // 오류가 생겼을시 리소스를 제거합니다.
    const mediaUnpublished = async (    
        client: AgoraRTCType.IAgoraRTCClient | null,
        payload: {
            mediaType:mediaType,
            user:AgoraRTCType.IAgoraRTCRemoteUser
        }, 
    ) => {
        if (!client) return;
        if(client.connectionState !== "CONNECTED") return;

        const { mediaType, user } = payload;

        const hasMediaTracks =
            videoTrackRef.current || audioTrackRef.current
    
        if (!hasMediaTracks) return;

        try{
            await client.unsubscribe(user, mediaType);
        } catch {
            throw Error ("미디어 언 퍼블리싱 실패");
        } finally {
            if (mediaType === "audio") await cleanAudioTrack();

            else if(mediaType === "video") await cleanVideoTrack();
        }
    };


     
    // 호스트 채널의 미디어 요소를 구독합니다.
    // 오류가 생겼을시 미디어 구독을 취소합니다.
    const mediaPublished = async (
        client: AgoraRTCType.IAgoraRTCClient | null,
        payload: {
            mediaType:mediaType,
            user:AgoraRTCType.IAgoraRTCRemoteUser
        }, 
    ) => {
        if(!client) return;

        const { user, mediaType } = payload;
        
        if (client.connectionState !== "CONNECTED") return;

        try {
            await client.subscribe(user, mediaType);
            
            if(!hostUIDRef.current) {
                hostUIDRef.current = user.uid.toString();
            }

            // 비디오 구독
            if (mediaType === "video") {
                const remoteScreenTrack = await user.videoTrack;
                
                if (remoteScreenTrack && videoElRef.current) {
                    videoTrackRef.current = remoteScreenTrack;
                    videoElRef.current.muted = true;
                    remoteScreenTrack.play(videoElRef.current);     
                    videoElRef.current.play();
                    videoElRef.current.style.objectFit = "scale-down"
                    
                    //비디오 비율 추출
                    await remoteScreenTrack.on('video-state-changed', () => {
                        const stats = remoteScreenTrack.getStats();
                        const w = stats.receiveResolutionWidth;
                        const h = stats.receiveResolutionHeight;
                        if(w !== 0 || h !== 0)
                            updateRatio(w/h, h/w);
                    })
                }
            }
            // 오디오 구독
            if (mediaType === 'audio') {
                const remoteAudioTrack = user.audioTrack;
                if (remoteAudioTrack) {
                    if(!audioElRef.current) return;
                        remoteAudioTrack.setVolume(volumeLevel);
                        audioElRef.current.srcObject = new MediaStream([remoteAudioTrack.getMediaStreamTrack()]);
                        audioTrackRef.current = remoteAudioTrack;
                        audioElRef.current.volume = 0.01 * volumeLevel;
                        audioElRef.current.muted = true;
                        if(audiolimit.current) {
                            audioTrackRef.current.play();
                        } else {
                            audioMute(true);
                        }                   
                } 
            }  
        } catch {
            await client.unsubscribe(user, mediaType);
                        
            if (mediaType === "audio") 
                await cleanAudioTrack();

            else if(mediaType === "video") 
                await cleanVideoTrack();

            throw Error ("미디어 퍼블리싱 실패");
        }
    }

    //#endregion


    return {
        mediaControls: { mediaPublished, mediaUnpublished },
        resourceCleaners: { cleanAudioTrack, cleanVideoTrack },
    };
};

export default useMediaPublish;