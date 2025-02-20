import type * as AgoraRTCType from "agora-rtc-sdk-ng";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useRef } from "react";

interface useClientAudience_payload {
    host_uid: string;
}

// 클라이언트 생성 및 채널 참가
const useClientAudience = (payload:useClientAudience_payload) => {
    const {
        host_uid,
    } = payload;

    const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID! || ""; 
    const clientRef = useRef<AgoraRTCType.IAgoraRTCClient | null>(null); 

    /**
    * 호스트 채널과의 연결을 종료하고 클라이언트 리소스를 정리합니다.
    * 모든 리스너를 제거하고 클라이언트를 초기 상태로 변경합니다.
    */
    const clearClient = async () => {
        if (clientRef.current === null) {
            console.log("클라이언트가 초기화되지 않았습니다.");
            return;
        }
        try{
            clientRef.current.removeAllListeners();
            await clientRef.current.leave();
        } finally {
            clientRef.current = null;
            console.log("클라이언트가 초기화되었습니다.");
        }
    };

    
    /**
    * RTC 클라이언트를 생성하고 호스트 채널에 참가합니다.
    * 오류 발생시 채널을 떠나고 모든 리소스를 정리합니다. 
    * 
    * @throws 채널 참가중 오류 발생 가능능
    */
    const initClient = async () => {
        if (!APP_ID) {
            throw new Error("Agora App ID를 찾을 수 없습니다.");
          }

        // 클라이언트 이미 존재
        if (clientRef.current) return;

        clientRef.current = AgoraRTC.createClient({ mode: "live", codec: "vp8", role: "audience" });
        const client = clientRef.current;
        try {
            await client.join(APP_ID, host_uid, null);
            console.log('성공적으로 host_room 참가 완료');
        } catch(err: unknown) {
            clearClient();
            throw err;
        }
    }

    
    return {
        clientRef,
        initClient,
        clearClient,
    };
};

export default useClientAudience;