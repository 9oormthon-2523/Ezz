import React from 'react';

interface Props {
  action: () => void;
  text: string;
}

const ActionButton = (props: Props) => {
  const { action, text } = props;
  return (
    <button
      className="rounded-2xl bg-white text-[#697183] text-[15px] font-blackHanSans py-[5px] px-[15px]"
      onClick={action}
    >
      {text}
    </button>
  );
};

export default ActionButton;
