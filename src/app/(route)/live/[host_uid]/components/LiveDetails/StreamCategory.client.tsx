import StateRenderer from "../StateRenderer.client";

/**
 * 스트리밍 카테고리 컴포넌트
 */
export const StreamCategory = () => {

    return (
        <div className="p-0 inline-block">
            <span className="text-[#32bb81] font-blackHanSans text-[14px] gap-[2px_7px] tracking-[-0.3px] leading-[18px] min-w-0">          
                <span id="stream-room-info-catagory">
                    <StateRenderer keyName="category" storeName="streamRoom"/>
                </span>
            </span>
        </div>
    );
};

export default StreamCategory;