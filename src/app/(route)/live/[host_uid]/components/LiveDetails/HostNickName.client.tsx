import Link from "next/link";
import StateRenderer from "../StateRenderer.client";
import { useParams } from "next/navigation";
/**
 * 호스트 닉네임 컴포넌트
 */
const HostNickName = () => {
    const { host_uid } = useParams<{ host_uid: string }>();

    return (
        <div role="paragraph" className="flex m-0 p-0">
            <div className="text-[#2e3033] text-[18px] leading-[22px] m-0 -mx-[6px] min-w-0 p-[4px_6px] relative font-bold">
                <Link 
                    href={`/channel/${host_uid}`}  
                    className="inline-flex max-w-[100%] align-top"
                >
                    <span 
                        id="host-info-nickname"
                        style={{textOverflow:"ellipsis"}} 
                        className="pr-[1px] overflow-hidden whitespace-nowrap"
                    >
                        <StateRenderer keyName="nickname" storeName="hostInfo"/>
                    </span>
                </Link>
                
            </div>
        </div>
    );
};

export default HostNickName;