import { useFetchStreamData } from '@/app/_hooks/streamList/useFetchStreamData';
import SkeletonStreamList from './skeletonUI/SkeletonStreamList';
import StreamList from './StreamList.server';

interface StreamComponentProps {
  slug?: string | string[];
}

const StreamComponent = ({ slug }: StreamComponentProps) => {
  const { data: streamData, isLoading } = useFetchStreamData(slug || undefined);

  if (isLoading) {
    return <SkeletonStreamList />;
  }

  if (!streamData || streamData.length === 0) {
    return <p className="text-center text-gray-500 mt-4">현재 진행 중인 방송이 없습니다.</p>;
  }

  return <StreamList streamData={streamData} />;
};

export default StreamComponent;
