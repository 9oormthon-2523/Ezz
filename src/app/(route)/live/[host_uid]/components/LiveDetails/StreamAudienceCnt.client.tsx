import StateRenderer from "../StateRenderer.client";
/**
 * 스트리밍 시청자 수 컴포넌트 
 */
const StreamAudienceCnt = () => {

  return (
    <strong 
      id="stream-room-info-audience-cnt" 
      className="text-#2e3033 text-[12px] font-semibold relative leading-[25px]"
    >
      <StateRenderer keyName="audience_cnt" storeName="streamRoom"/>명 시청 중 •
    </strong>
  );
};

export default StreamAudienceCnt;