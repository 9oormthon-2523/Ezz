import Image from 'next/image';

interface ChannelProfileProps {
  nickname: string;
  followerCount: number;
  context: string;
  img_url: string | null;
  isFollowing: boolean;
  isLoggedInUser: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
  onChannelStudioClick: () => void;
  onChannelManagementClick: () => void;
}

const ChannelProfile = ({
  nickname,
  followerCount,
  context,
  img_url,
  isFollowing,
  isLoggedInUser,
  onFollow,
  onUnfollow,
  onChannelStudioClick,
  onChannelManagementClick,
}: ChannelProfileProps) => {
  const defaultImage = "/channelPage/blank_profile.svg";

  return (
    <div className="flex items-start justify-between max-w-7xl p-4 rounded-lg">
      <div className="flex items-center">
        <div className="w-24 h-24 rounded-full flex-shrink-0 shadow-md mr-4 relative">
          <Image 
            src={img_url || defaultImage} 
            alt={`${nickname} profile`} 
            layout="fill" 
            objectFit="cover" 
            className="rounded-full" 
          />
        </div>
        <div className="flex-grow flex flex-col justify-center">
          <p className="text-2xl font-black">{nickname}</p>
          <p className="text-md font-semibold text-gray-500">팔로워 {followerCount}명</p>
          <p className="text-md font-medium text-gray-400">{context}</p>
        </div>
      </div>

      {isLoggedInUser ? (
        <div className="flex flex-row gap-2">
          <button 
            onClick={onChannelStudioClick}
            className="p-3 h-9 border border-gray-300 hover:bg-gray-200 rounded-full flex items-center justify-center text-md font-black"
          >
            <Image
              src="/channelPage/video.svg"
              alt="아이콘"
              width={24}
              height={24}
              className="mr-1"
            />
            방송하기
          </button>
          <button 
            onClick={onChannelManagementClick}
            className="p-3 h-9 border border-gray-300 hover:bg-gray-200 rounded-full flex items-center justify-center text-md font-black"
          >
            <Image
              src="/channelPage/setting.svg"
              alt="아이콘"
              width={24}
              height={24}
              className="mr-1"
            />
            채널 관리
          </button>
        </div>
      ) : (
        <button
          onClick={isFollowing ? onUnfollow : onFollow}
          className={`p-3 h-9 rounded-full flex items-center justify-center text-white font-black ${
            isFollowing ? 'bg-gray-400 hover:bg-gray-500' : 'bg-[#1bb373] hover:bg-[#178c5c]'
          }`}
        >
          <Image
            src="/channelPage/heart.svg"
            alt="아이콘"
            width={18}
            height={18}
            className="mr-1"
          />
          {isFollowing ? '팔로잉' : '팔로우'}
        </button>
      )}
    </div>
  );
};

export default ChannelProfile;
