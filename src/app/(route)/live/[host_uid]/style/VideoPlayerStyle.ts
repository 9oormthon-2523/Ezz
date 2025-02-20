import { CSSProperties } from "react"

export const container_style = (isFullOrWide:boolean):CSSProperties => {
    return {
        maxHeight: !isFullOrWide ? "calc(100vh - 226px)" : undefined,
        marginRight : !isFullOrWide ? "4px" : undefined,
        position : !isFullOrWide ? "relative" : undefined
    };
};

export const containerVideoPlayer_style = (isFullOrWide:boolean, isChatOpen:boolean, wh:{w:number, h:number}):CSSProperties => {
    return{
        width: !isFullOrWide && isChatOpen ?  wh.w : wh.w,
        height:wh.h, 
    };
};

export const frameVideoPlayer_style = (isFullOrWide:boolean,  wh:{w:number, h:number}, h_rate:number):CSSProperties => {
    return {
        width:"100%", 
        height:wh.h, 
        maxWidth: isFullOrWide ? (window.innerHeight * h_rate) + "px" : wh.h * h_rate + "px" 
    };
};

export const videoControler_style = (isFullOrWide:boolean, isChatOpen:boolean, wh:{w:number, h:number}):CSSProperties =>{
    return {
        width: `${wh.w}px`,  
        height: !isFullOrWide ? wh.h+"px" : !isChatOpen ? "100vh" : wh.h+"px",
        top: !isChatOpen || !isFullOrWide ? "0":"" 
    };
};