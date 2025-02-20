import useLiveControl from "@/app/_store/stores/live/useLiveControl";
import { useEffect, useState } from "react";

const StreamTime = () => {
    const startTime = useLiveControl(state => state.streamRoom.state.start_time);
    const is_active = useLiveControl(state => state.streamRoom.state.is_active);
    const [viewTime, setViewtime] = useState<string>("00:00:00");

    useEffect(() => {
        if (!startTime || !is_active) {
            setViewtime("00:00:00");
            return;
        }
        
        const givenTime = new Date(startTime);

        const interval = setInterval(() => {
        const currentTime = new Date();
        const timeDifference = currentTime.getTime() - givenTime.getTime();

        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDifference / 1000) % 60);

        const formattedTime = `${String(hours)
            .padStart(2, "0")}:${String(minutes)
                .padStart(2, "0")}:${String(seconds)
                    .padStart(2, "0")}`;

            setViewtime(formattedTime);
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [startTime, is_active]);

  return (
      <>
        {!startTime ? "00:00:00" : viewTime} 
      </>
  );
};

/**
 * 스트리밍 경과시간 컴포넌트
 */
const StreamTimeView = () => {

  return(
    <strong
      id="stream-room-info-stream-time-view"
      className="text-#2e3033 ml-[4px] text-[12px] font-semibold relative leading-[25px]"
    >
      <StreamTime /> 스트리밍 중
    </strong>
  );
};

export default StreamTimeView;
