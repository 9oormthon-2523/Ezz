import SvgIcon from "@/app/_components/SVGIcon.server";

const LiveBox = () => {
    return (
        <em className='m-w-[55px] h-[25px] leading-[25px] bg-[#e02020] items-center rounded-[4px] text-white inline-flex text-[12px] font-bold justify-center p-[0_4px] align-top'>
        <SvgIcon name='VideoLive' width={39} height={13}/>
      </em>
    );
};

export default LiveBox;