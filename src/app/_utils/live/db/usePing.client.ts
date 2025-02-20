import useLiveControl from '@/app/_store/stores/live/useLiveControl';
import { createClient } from '@/app/_utils/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * 호스트가 핑을 전달하면 호스트에게 응답해주는 훅
 * 시청자 수를 세기 위함
 */

const usePing = (client_uid:string|null) => {    
    const supabase = createClient();
    const { host_uid } = useParams<{ host_uid: string }>();
    const is_active = useLiveControl(state => state.streamRoom.state.is_active);

    const channelRef = useRef<RealtimeChannel | null>(null);

    useEffect(() => {
        if (is_active) {
            if (!channelRef.current) {
                const clientUID = 
                    client_uid || localStorage.getItem("stream_client_uid") || crypto.randomUUID();

                // 로그인 했음에도 로컬 스토리지가 존재하면 삭제
                if (client_uid && localStorage.getItem("stream_client_uid")) {
                    localStorage.removeItem("stream_client_uid");
                }

                // 기존에 로컬 스토리지가 존재하지 않는 경우 
                if (!localStorage.getItem("stream_client_uid")) {
                    localStorage.setItem("stream_client_uid", clientUID);
                }

                const channel = supabase.channel(`audienceCnt:${host_uid}`);
                channelRef.current = channel;

                channel.subscribe((status) => {
                    if (status === "SUBSCRIBED") {
                        console.log(`Successfully subscribed to audienceCnt:${host_uid}`);
                    }
                });

                channel.on('broadcast', { event: 'ping' }, () => {
                    channel.send({
                        type: "broadcast",
                        event: 'pong',
                        payload: { clientUID },
                    });
                });
            }
        } else {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
                channelRef.current = null;
            }
        }

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
                channelRef.current = null;
            }
        };
    }, [client_uid, host_uid, supabase, is_active]);
};

export default usePing;
