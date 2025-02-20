import Image from 'next/image';

interface ChannelCardProps {
  id: string;
  nickname: string;
  profile_img: string | null;
  followerCount: number;
}

const FollowChannel = ({ nickname, profile_img,followerCount }: ChannelCardProps) => {
  const defaultImage = "/channelPage/blank_profile.svg";
  return (
    <li className="flex items-center gap-4 pb-4">
      <div className="w-20 h-20 rounded-full flex-shrink-0 shadow-md mr-2 relative">
        <Image 
          src={profile_img || defaultImage} 
          alt={`${nickname} profile`} 
          layout="fill" 
          objectFit="cover" 
          className="rounded-full" 
        />
      </div>
      <div className='flex-grow flex flex-col justify-center'>
        <p className="text-lg font-bold">{nickname}</p>
        <p className="text-md font-semibold text-gray-500">팔로워 {followerCount}명</p>
      </div>
    </li>
  );
};

export default FollowChannel;
