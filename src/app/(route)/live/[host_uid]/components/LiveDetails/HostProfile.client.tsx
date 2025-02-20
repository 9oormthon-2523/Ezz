import useLiveControl from "@/app/_store/stores/live/useLiveControl";
import { useParams } from "next/navigation";
import { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

/*
 * 호스트 프로필 이미지 컴포넌트
 */

const HostProfile = () => {
    const { host_uid } = useParams();
    const is_active = useLiveControl(state => state.streamRoom.state.is_active);
    const profile_img = useLiveControl(state => state.hostInfo.state.profile_img);
    
    const circle_style:CSSProperties = {
        background: is_active ? "linear-gradient(320deg,#5bda30,#a8a8a8d5)" : undefined,
    } as const;

    return (
        <Link
            style={circle_style}
            aria-label="호스트 프로필로 이동"
            href={`/channel/${host_uid}`} 
            className="select-none mr-[0.5rem] overflow-hidden relative flex justify-center items-center w-[60px] h-[60px] rounded-full flex-none p-[0.2px] m-[1.8px_3px]"
        >

            <div className='w-[52px] h-[52px] border-[2px] overflow-hidden border-solid border-[white] bg-[#ffffff] left-0 top-0 rounded-full flex justify-center items-center'>    
                <Image 
                    id="host-info-profile-img"
                    priority 
                    width={60} 
                    height={60} 
                    alt="호스트 프로필 이미지" 
                    src={profile_img ||"/userImage.webp"} 
                    className="bg-[#0000000f] rounded-[inherit] object-cover relative align-top border-0"
                />
            </div>            
        </Link>
    );
};

export default HostProfile;