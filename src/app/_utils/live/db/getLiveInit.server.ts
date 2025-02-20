import { getHostInitDto, getStreamRoomDto } from '@/app/_types/live/liveType';
import { createClient } from "@/app/_utils/supabase/client";

/**
 * 라이브 페이지 초기 데이터 가져오기 (호스트)
 */

interface initDto {
  hostInfo: getHostInitDto;
  streamRoom:getStreamRoomDto;
};

export const getLiveInit = async (id: string): Promise<null | initDto> => {
    const supabase = createClient(); 
    
    try {
        const { data: streamRoom, error: roomError } = await supabase
            .from('streaming_rooms')
            .select('title, start_time, is_active, audience_cnt, nickname, tags, category') 
            .eq('uid', id)
            .single<getStreamRoomDto>();

        if (roomError) {
            console.error("해당 유저의 streaming_rooms이 존재하지 않아요");
            return null; 
        }

        const { data: hostInfo, error: hostError } = await supabase
            .from('users')
            .select('nickname, profile_img')
            .eq('id', id)
            .single<getHostInitDto>();

        if (hostError) {
            console.error("호스트의 정보를 찾을 수 없습니다.");
            return null;
        }

        if (hostInfo && streamRoom) {
            return {
                hostInfo,
                streamRoom,
            };
        } else {
            console.error(`${id}와 매칭되는 데이터가 없습니다.`);
            return null;
        }
    } catch (error) {
        console.error("알 수 없는 오류", error);
        return null;
    }
};
