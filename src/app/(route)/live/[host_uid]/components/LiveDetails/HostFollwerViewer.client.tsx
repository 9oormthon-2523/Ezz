import { FollowInfo } from "@/app/_types/follow.type";

interface Props {
    data:FollowInfo[]|undefined;
    isLoading:boolean;
    error:Error | null;
};

/*
* 호스트 팔로워 수 컴포넌트
*/
const HostFollowerViwer = (props:Props) => {
    const { 
        data,
        isLoading,
        error,
    } = props;

    const followerCnt = error || isLoading || !data ? "0" : data.length; 

    return (
        <p 
            id="host-info-follower-cnt"
            className='mt-[2px] text-[13px] font-semibold text-[#666]'
        >
            팔로워 { followerCnt }명
        </p> 
    );
};

export default HostFollowerViwer;