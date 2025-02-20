import { Database } from "../../_utils/supabase/database.types";

// get base
export type HostInfoType = Database["public"]["Tables"]["users"]["Row"];
export type StreamRoomType = Database["public"]["Tables"]["streaming_rooms"]["Row"];

// for init dto
export type getHostInitDto = Pick<HostInfoType, "nickname"|"profile_img">;
export type getStreamRoomDto = Omit<StreamRoomType, "thumbnail"|"nickname"|"uid">;

// for zustand
export type HostInfoState = getHostInitDto;
export type StreamRoomState = {
  host_uid:string,
  client_uid:string|null,
} & getStreamRoomDto;