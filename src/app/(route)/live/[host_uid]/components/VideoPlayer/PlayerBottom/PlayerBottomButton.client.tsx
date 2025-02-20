"use client"
import SvgIcon, { SvgComponentNames } from "@/app/_components/SVGIcon.server"
import React from "react"

/**
 * 플레이어 비디오 기능 버튼
 */

interface PlayerBottomButtonProps {
    svgName: SvgComponentNames;
    style?: string;
    info:string;
    onClick?: () => void;
}

const PlayerBottomButton = (props:PlayerBottomButtonProps) => {
    const { svgName, style, info, onClick } = props;
    
    return (
        <button onClick={onClick} aria-label={info} className="select-none text-[#fff] w-[34px] h-[34px] rounded-full hover:bg-[#ffffff20] m-[4px] relative flex group">
            <span onClick={e => {e.stopPropagation()}} className=" absolute top-[-46px] bg-[#00000099] rounded-[14px] text-[#fff] text-[13px] h-[27px] left-[50%] m-0 p-[0_12px] text-center translate-x-[-50%] hidden items-center justify-center max-w-[200px] truncate opacity-0 group-hover:flex group-hover:opacity-100 transition-opacity duration-100">
                {info}
            </span>

            <span className={`w-[32px] h-[32px] overflow-hidden m-0 p-0 align-baseline`}>
                <SvgIcon name={svgName} width={34} height={34} className={`align-top text-[#fff] ${style}`}/> 
            </span>
        </button>

    );
};

export default PlayerBottomButton;