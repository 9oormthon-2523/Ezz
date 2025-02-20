import StateRenderer from "../StateRenderer.client";
/**
 * 스트리밍 제목 컴포넌트
 */
const StreamTitle = () => {
    
    return (
        <h2 
            id="stream-room-info-title"
            className="text-[#2e3033] mb-1 text-[22px] font-bold tracking-[-0.3px] leading-[28px]"
        >
            <StateRenderer keyName="title" storeName="streamRoom"/>
        </h2>
    );
};

export default StreamTitle;