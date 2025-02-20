import useLiveControl from "@/app/_store/stores/live/useLiveControl";
import { getHostInitDto, StreamRoomState } from "@/app/_types/live/liveType";

type State = keyof StreamRoomState | keyof getHostInitDto

interface Props<K extends State> {
    storeName: "streamRoom" | "hostInfo";
    keyName: K;
}

/**
 * 키를 받아 Zustand 상태 값만 렌더링하는 컴포넌트
 * 
 *  * 사용 예시:
 * <StateRenderer storeName="streamRoom" keyName="category" />
 * <StateRenderer storeName="hostInfo" keyName="nickname" />
 */

const StateRenderer = <K extends State>(
    { storeName, keyName }: Props<K>
) => {
    const data = useLiveControl(state => {
      if (storeName === "streamRoom") {
        return state.streamRoom.state[keyName as keyof StreamRoomState];
      } else {
        return state.hostInfo.state[keyName as keyof getHostInitDto];
      }
    });
  
    return <>{data}</>;
};
  
export default StateRenderer;