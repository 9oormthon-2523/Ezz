import { useFollowAction } from "@/app/_store/queries/follow/mutation";
import useLiveControl from "@/app/_store/stores/live/useLiveControl";
import { CSSProperties, useEffect, useState } from "react";
import SvgIcon from "@/app/_components/SVGIcon.server";
import { FollowInfo } from "@/app/_types/follow.type";


interface Props {
    data:FollowInfo[]|undefined; 
    isLoading:boolean;
    error:Error | null;
};

/**
 * 호스트 팔로워 버튼 컴포넌트
 */

const HostFollowerBtn = (props: Props) => {
    const {
        data,
        error,
        isLoading,
    } = props;

    const { followMutate, unfollowMutate } = useFollowAction();
    const [followState, setFollowState] = useState<boolean>(false);
    const nickname = useLiveControl(state => state.hostInfo.state.nickname);
    const host_uid = useLiveControl(state => state.streamRoom.state.host_uid);
    const client_uid = useLiveControl(state => state.streamRoom.state.client_uid);

    const title = !followState ? '팔로우' : '팔로우 중';
    const svgIcon = !followState ? 'VideoUnFollow' : 'VideoFollow';
    const no_allowed = !client_uid || isLoading || error || client_uid === host_uid;

    const onClickHandler = () => {
        if (!client_uid || client_uid === host_uid || isLoading || error || !nickname) return;
    
        const fn = followState ? unfollowMutate : followMutate;
        fn({ nickname, uid: host_uid });
    };

    const style:CSSProperties = {
        color:followState?"black":"#fff",
        backgroundColor:followState? "#f3f4f6": "#1bb373",
        cursor: no_allowed ? "not-allowed" : undefined,
        filter: no_allowed ? "brightness(0.8)" : undefined,
    } as const;
        
    useEffect(()=>{
        if (!data || !client_uid) return;
        setFollowState(data.some(({ follower }) => follower.uid === client_uid));
    },[data, client_uid]);

    return (
        <div className="flex ml-4 pt-[19px] relative">
            <div className="mr-[6px] relative flex gap-2">
                <button 
                    id="host-info-follow-button"
                    style={style} 
                    onClick={onClickHandler} 
                    className={`className="bg-[#1bb373] text-[#fff] rounded-[17px] pr-[16px] pl-[12px] h-[34px] inline-flex items-center justify-center gap-x-[4px] text-sm leading-none font-sans cursor-pointer transition-all duration-200 ease-in-out relative align-top focus:outline-none hover:brightness-90`}
                >
                    <SvgIcon 
                        width={20} 
                        height={20}
                        name={svgIcon} 
                    />

                    <span id="host-info-follow-button-state">
                        {title}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default HostFollowerBtn;