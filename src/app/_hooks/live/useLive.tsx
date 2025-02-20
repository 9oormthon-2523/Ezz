import { IRemoteVideoTrack, IRemoteAudioTrack } from "agora-rtc-sdk-ng";
import useClientAudience from "./client/useClinetAudience..client";
import useMediaPublish from "./client/useMediaPublish.client";
import useMediaControl from "./media/useMediaControl.client";
import { useEffect, useRef, useState } from "react";

interface Payload {
    host_uid:string;
    streaming_is_active:boolean;
};

const useLive = (payload: Payload) => {
    const { 
        host_uid,
        streaming_is_active,
    } = payload;

    const [ratio, setRatio] = useState<[number, number]>([1.83, 0.55]); 
    const updateRatio = (a:number, b:number) => setRatio([a,b]);

    // host_uid Agora에서 받는 users의 uid는 스트림을 임의의 number로 바꿔버림 
    // 때문에 기존 uid로 식별 불가능해서 미디어를 받을 때 uid를 따로 저장
    const hostUIDRef = useRef<null | string>(null);

    //오디오 정책 제한
    const audiolimit = useRef<boolean>(false);

    // Element
    const audioElRef = useRef<null | HTMLAudioElement>(null);
    const videoElRef = useRef<null | HTMLVideoElement>(null);
    const canvasElRef = useRef<null | HTMLCanvasElement>(null);

    // Resource
    const audioTrackRef = useRef<null | IRemoteAudioTrack>(null); 
    const videoTrackRef = useRef<null | IRemoteVideoTrack>(null);

    // 클라이언트
    const { 
        clientRef,
        initClient, 
        clearClient,
     } = useClientAudience({ host_uid });


    // 미디어 퍼블리싱 함수
    const {
        mediaControls:{ mediaPublished, mediaUnpublished },
        resourceCleaners: { cleanAudioTrack, cleanVideoTrack },
    } = useMediaPublish({
        audiolimit,
        hostUIDRef,
        audioElRef,
        videoElRef,
        audioTrackRef,
        videoTrackRef,
        updateRatio,
    }); 


    // 미디어 제어 훅
    const {
        EraseCanvas
    } = useMediaControl({
        audiolimit,
        videoElRef,
        canvasElRef,
        audioTrackRef,
        videoTrackRef,
    });

    //  // 모든 리소스 클리어
     const clearAll = async () => {
        EraseCanvas();
        await cleanAudioTrack();
        await cleanVideoTrack();
        await clearClient().then(() => {
            // 미들웨어 측 uid 삭제
            hostUIDRef.current = null;
            EraseCanvas();
        });
     }

     const initStreamClient = async () => {
        // 클라이언트 생성 및 채널 참가
        await initClient();
                        
        if (!clientRef.current) return;
        const client = clientRef.current;
        
        // 미디어 퍼블리싱
        client.on('user-published', (user, mediaType) => {
            mediaPublished(client, { user, mediaType });
        });

        // 미디어 언퍼블리싱
        client.on('user-unpublished', (user, mediaType) =>{
            mediaUnpublished(client, { user, mediaType });
            EraseCanvas();
        });

        // 호스트가 채널 나가면 시청자는 모든 리소스 정리
        client.on('user-left', async (user) => {
            if(!hostUIDRef.current) return;
            if(hostUIDRef.current === user.uid.toString()) clearAll();  
        });
     }

    // 의존성 우회
    const startStreamRef = useRef(initStreamClient);
    const clearResorceRef = useRef(clearAll);

    useEffect(()=>{
        const streamState = streaming_is_active ? "Stream_ON" : "Stream_OFF";
        
        if (streamState === "Stream_ON") {
            startStreamRef.current();
        } else if (streamState === "Stream_OFF") {
            clearResorceRef.current();
        } 

    }, [streaming_is_active]);

     return {
        ratio,
        videoElRef,
        audioElRef,
        canvasElRef,
     };
};

export default useLive;