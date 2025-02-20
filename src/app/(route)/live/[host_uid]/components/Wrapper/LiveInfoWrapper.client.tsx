import { ReactNode } from "react";

interface Props {
    children?:ReactNode;
};

/**
 * 스트리밍 정보 래핑 컴포넌트
 * **/

const LiveInfoWrapper = (props: Props) => {
    const { children } = props;

    return (
        <div id="live-information-details" className="flex-none p-[15px_30px_22px]">
            <div id="live-information-details-container" className="break-words break-all">
                {children}
            </div>
        </div>
    );
};

export default LiveInfoWrapper;