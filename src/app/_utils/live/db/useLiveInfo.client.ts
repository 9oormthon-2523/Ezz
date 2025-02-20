
"use client"

import { HostInfoState, StreamRoomState } from "@/app/_types/live/liveType";
import useLiveControl from "@/app/_store/stores/live/useLiveControl";
import { createClient } from "../../supabase/client";
import { useParams } from 'next/navigation';
import { useEffect, useRef } from "react";

interface Payload {
  hostInfo:HostInfoState;
  streamRoom:StreamRoomState;
};

/**
 * 초기값 세팅 및 실시간 데이터 구독 훅
 */
const useLiveInfo = (payload:Payload) => {
    const {
        hostInfo,
        streamRoom,
    } = payload;
    const supabase = createClient();
    const { host_uid } = useParams();
    const updateHostState = useLiveControl(state => state.hostInfo.actions.updateState);
    const updateStreamState = useLiveControl(state => state.streamRoom.actions.updateState);
    const updateField = useLiveControl(state => state.streamRoom.actions.updateField);
    
    const LIMITCNT = 3; // 구독 실패시 재시도 횟수
    const linkLimit = useRef<number>(0);

    // 초기 값 세팅 및 리얼 타임 데이터 구독
    useEffect(() => {
        updateHostState(hostInfo);
        updateStreamState(streamRoom);

        const subscribeToRealtime = () => {
          const getRoomDto = supabase
            .channel(`streaming-room-updates-${host_uid}`)
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "streaming_rooms", filter: `uid=eq.${host_uid}`, },
                (payload) => {
                    try {
                    if (payload.new.title !== payload.old.title) {
                        updateField("title", payload.new.title);
                    }

                    if (payload.new.is_active !== payload.old.is_active) {
                        updateField("is_active", payload.new.is_active);
                    }

                    if (payload.new.audience_cnt !== payload.old.audience_cnt) {
                        updateField("audience_cnt", payload.new.audience_cnt);
                    }

                    if (payload.new.category !== payload.old.category) {
                        updateField("category", payload.new.category);
                    }

                    if (payload.new.tags !== payload.old.tags) {
                        if(!Array.isArray(payload.new.tags)) return;
                            updateField("tags", [...payload.new.tags]);     
                    }

                    if (payload.new.start_time !== payload.old.start_time) {
                        updateField("start_time", payload.new.start_time);
                    }

                    } catch (error) {
                        console.error("실시간 데이터 처리 중 오류 발생:", error);
                    }
                }
            )
            .subscribe((status) => {
                if (status === "SUBSCRIBED") {
                    console.log("실시간 데이터 연결 성공");
                    linkLimit.current = 3;
                } else if (status === "TIMED_OUT") {
                    linkLimit.current++;
                    console.error("리얼타임 구독 실패 또는 연결 종료:", status);
                    if (linkLimit.current < LIMITCNT) {
                        setTimeout(() => {
                            console.log("실시간 연결 재시도...");
                            subscribeToRealtime();
                        }, 5000); 
                    }
                }
            });
  
            return getRoomDto;
        };

        const channelInstance = subscribeToRealtime();
        
        return () => { 
            // 리얼타임 데이터 구독 해제
            channelInstance.unsubscribe();
        };
    },[]);
    // 한 번만 구독이 필요하기에 의존성 뺌
    
}  

export default useLiveInfo;