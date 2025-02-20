import DashBoardBox from '../DashBoardBox.server';
import DashBoardTitle from '../DashBoardTitle.server';
import NoticeItem from '../NoticeItem';

const Widget5 = () => {
  const list = [
    {
      title: '원 클릭으로 편하게 방송을 시작해 보세요.',
      date: '2024.12.18',
    },
    {
      title: '방송관리 > "설정", "알림", "리허설 방송하기" 는 추후 구현 예정입니다.',
      date: '2024.12.31',
    },
    {
      title: '시청자 관리 > "구독자", "활동 제한" 은 추후 구현 예정입니다.',
      date: '2025.01.09',
    },
  ];

  return (
    <DashBoardBox>
      {/* 제목 */}
      <DashBoardTitle title="공지사항" />

      {/* 리스트 */}
      <ul className="mt-[10px] list-none m-0 p-0 text-[14px] leading-[1.2]">
        {list.map((item, idx) => (
          <NoticeItem key={idx} {...item} />
        ))}
      </ul>
    </DashBoardBox>
  );
};

export default Widget5;
