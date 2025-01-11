import { RefObject, useEffect } from "react";
import type * as AgoraRTCType from 'agora-rtc-sdk-ng';

// 창 닫기, 라우팅 이벤트가 일어날 때 db 테이블에 스트리밍 상태를 false로 전환
const useStreamCleanup = (uid:string, clientRef: RefObject<AgoraRTCType.IAgoraRTCClient | null>) => {

    // 호스트의 is_active = false;
    const handleStreamClose = () => {
        const payload = JSON.stringify({ uid });
        navigator.sendBeacon('/api/user/streamingcleanup', payload);
    };

    // 클라이언트 초기화
    const clientReset = () => {
        if(clientRef.current){
          clientRef.current.removeAllListeners();
          clientRef.current?.leave();
          clientRef.current = null;
        }
    }

    useEffect(() => {
        const cleanup = () => {
            handleStreamClose();
            clientReset();
        }

        window.addEventListener("beforeunload", cleanup);

        return () => {
            cleanup(); // 언마운트(라우팅 이동)시 클린업
            window.removeEventListener("beforeunload", cleanup); // 창 닫기시 클린업
        };
    }, []); 

}

export default useStreamCleanup;