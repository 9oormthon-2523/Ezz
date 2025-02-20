import useLiveControl from "@/app/_store/stores/live/useLiveControl";
/**
 * 스트리밍 태그 컴포넌트
 */
const StreamTags = () => {
    const tags = useLiveControl(state => state.streamRoom.state.tags);
    
    return (
        <ul 
            id="stream-room-info-tags"
            className="text-[#898989] font-blackHanSans overflow-hidden flex flex-wrap items-center justify-center text-[9px] gap-[4px]"
        >
            {
                tags.map((tag, idx) => {
                    return (
                        <li key={`${tag}${idx}`} className="m-0 p-0">
                            <div className="inline-block align-top rounded-[5px] relative text-[inherit] border-[#00000026] border-solid border-[1px]">
                                <span className="mt-[1px] break-words p-[0_6px] rounded-[5px] inline-block align-top">
                                    { tag }
                                </span>
                            </div>
                        </li>
                    );
                })
            }
        </ul>
    );
};

export default StreamTags;

