import useLiveControl from "@/app/_store/stores/live/useLiveControl";

/**
 * 채팅 포지션 업데이트
 */
const useChatPositionUpdater = () => {

    const HEIGHT_RATE = 0.6;

    const isChatOpen = useLiveControl(state => state.screen.state.isChatOpen);
    const isFullOrWide = useLiveControl(state => state.screen.state.isFullOrWide);
    const updateChatPosition = useLiveControl(state => state.screen.actions.updateChatPosition);

    const calculateChatPosition = (resizeRate: number) => {
        if (!isFullOrWide || !isChatOpen) return;

        const videoHeight = window.innerWidth * resizeRate;
        const totalHeight = window.innerHeight;

        const newPosition = videoHeight / totalHeight > HEIGHT_RATE ? "side" : "bottom";
        updateChatPosition(newPosition);
    };

    return { calculateChatPosition };
};

export default useChatPositionUpdater;