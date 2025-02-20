import useLiveControl from "@/app/_store/stores/live/useLiveControl";
import { useFollowerQuery } from "@/app/_store/queries/follow/query";
import LiveInfoWrapper from "../components/Wrapper/LiveInfoWrapper.client";
import HostProfile from "../components/LiveDetails/HostProfile.client";
import HostFollowerBtn from "../components/LiveDetails/HostFollowerBtn.client";
import HostFollowerViwer from "../components/LiveDetails/HostFollwerViewer.client";
import StreamTags from "../components/LiveDetails/StreamTags.client";
import StreamTitle from "../components/LiveDetails/StreamTitle.client";
import StreamCategory from "../components/LiveDetails/StreamCategory.client";
import StreamTimeView from "../components/LiveDetails/StreamTimeViewer.client";
import StreamAudienceCnt from "../components/LiveDetails/StreamAudienceCnt.client";
import HostNickName from "../components/LiveDetails/HostNickName.client";

/**
 * 라이브 정보 컴포넌트 (호스트 정보, 스트리밍 정보)
 */
const LiveDetail = () => {
    const is_active = useLiveControl(state => state.streamRoom.state.is_active);

    return (
        <LiveInfoWrapper>

            {/* 스트리밍 룸 정보 */}
            { is_active && <StreamRoomInformation/> }

            {/* 호스트 정보 */}
            <HostInformation/>

        </LiveInfoWrapper>
    );
};

export default LiveDetail;


/**
 * 스트리밍 정보 컴포넌트
 */
const StreamRoomInformation = () => {
    return(
        <section 
            id="stream-room-info-section" 
            aria-labelledby="stream-room-info"
            className="items-start flex flex-col w-full"
        >
            <StreamTitle/>

            <div className='flex gap-[7px] items-center'>
                <StreamCategory/>
                <StreamTags/>

                <div>
                    <StreamAudienceCnt/>
                    <StreamTimeView/>
                </div>
            </div>
        </section>
    );
};

/**
 * 호스트 정보 컴포넌트
 */
const HostInformation = () => {
    const host_uid = useLiveControl(state => state.streamRoom.state.host_uid);
    const followerQuery = useFollowerQuery(host_uid);

    return (
        <section
            id="host-info-section" 
            aria-labelledby="host-info"
            className="mt-[6px] items-start flex w-full"
        >
            <h2 id="host-info-title" className="sr-only">호스트 정보</h2>
            <HostProfile/>
            <div className="self-center flex flex-1 flex-col min-w-0">
                <HostNickName/>
                <HostFollowerViwer {...followerQuery}/>
            </div>
            
            <HostFollowerBtn {...followerQuery}/>
        </section>
    );
};
