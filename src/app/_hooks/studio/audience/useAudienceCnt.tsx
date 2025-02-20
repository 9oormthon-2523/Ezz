import { createClient } from '@/app/_utils/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useState, useRef } from 'react';

/**
 * 시청자 수 파악
 */

interface useAudienceCntPayload {
  host_uid: string;
}

const useAudienceCnt = (payload: useAudienceCntPayload) => {
  const { host_uid } = payload;

  const supabase = createClient();
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // 타이머 ID 저장
  const [audience, setAudience] = useState<Record<string, number>>({}); // 시청자 dto 저장
  const [pingChannel, setPingChannel] = useState<RealtimeChannel | null>(null); // 채널 저장

  const TIME = 5 * 1000;

  // db 업데이트
  const updateAudienceCnt = async (cnt: number) => {
    const { error, count } = await supabase.from('streaming_rooms').update({ audience_cnt: cnt }).eq('uid', host_uid);

    if (error) {
      console.log('시청자 수 반영 실패', error.message);
    } else if (count === 0) {
      console.log('시청자 수가 기존 값과 동일하여 변경되지 않음');
    } else {
      console.log('시청자 수 반영 성공');
    }
  };

  // 채널 활성화
  const activateChannel = () => {
    if (pingChannel) return;

    const channel = supabase.channel(`audienceCnt:${host_uid}`);
    setPingChannel(channel);

    // 채널 구독 생성 및 확인
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Successfully subscribed to audienceCnt:${host_uid}`);
      }
    });

    // 'ping' TIME초마다 시청자들에게 메시지 전송
    intervalRef.current = setInterval(() => {
      channel.send({
        type: 'broadcast',
        event: 'ping',
        payload: { host_uid },
      });

      setAudience((prev) => {
        const now = Date.now();
        // 갱신이 안된 시청자 제외
        const activeAudiences = Object.entries(prev).filter(([, timestamp]) => now - timestamp < TIME + 500);

        const updated = Object.fromEntries(activeAudiences);

        // 필터링된 시청자 db에 갱신함
        updateAudienceCnt(activeAudiences.length);

        return updated;
      });
      console.log(audience);
    }, TIME);

    // 'pong' 시청자 uid, 현재 시간과 함께 저장 or 기존 데이터 시간 갱신
    channel.on('broadcast', { event: 'pong' }, (message) => {
      const clientId = message.payload?.clientUID;

      if (!clientId) return;

      // uid + 현재 시간 추가 및 갱신
      setAudience((prev) => {
        const now = Date.now();
        const updated = { ...prev };

        updated[clientId] = now;

        return updated;
      });
    });
  };

  // 채널 비활성화 및 리소스 정리
  const deactivateChannel = () => {
    if (pingChannel) {
      // 채널 파괴
      supabase.removeChannel(pingChannel);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setPingChannel(null);
      console.log('시청자 수 채널 삭제 완료');
    }
  };

  return { activateChannel, deactivateChannel };
};

export default useAudienceCnt;
