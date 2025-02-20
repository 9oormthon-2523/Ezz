"use client"
import SvgIcon, { SvgComponentNames } from "@/app/_components/SVGIcon.server";

/**
 * 비디오 헤더 전용 버튼
 */

export interface PlayerHeaderButtonProps {
    fnName?:string;
    onClick: () => void;
    iconName: SvgComponentNames;
}
  
const PlayerHeaderButton = (props:PlayerHeaderButtonProps) => {
    const { onClick, iconName, fnName } = props;

    return (
        <button aria-label={fnName} onClick={onClick} className='text-[#141517] relative overflow-hidden outline-none focus:outline-none rounded-[12px] hover:bg-[#ffffff6c]'>
            <SvgIcon name={iconName} width={36} height={36}/>
        </button>
    );
};

export default PlayerHeaderButton;