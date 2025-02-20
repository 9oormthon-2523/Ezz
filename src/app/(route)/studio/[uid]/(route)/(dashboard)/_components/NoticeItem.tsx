interface ListItemProps {
  title: string;
  date: string;
}

const NoticeItem = (props: ListItemProps) => {
  const { date, title } = props;

  return (
    <div className="mb-1 w-auto text-[13px]">
      <div className="grid grid-flow-col items-center w-full leading-5 tracking-[-.5px] group">
        <strong className="text-[#222] flex-grow min-w-0 overflow-hidden font-normal">{title}</strong>
        <div className="text-[#697183] flex-none leading-[18px] ml-auto pl-8">{date}</div>
      </div>
    </div>
  );
};

export default NoticeItem;
