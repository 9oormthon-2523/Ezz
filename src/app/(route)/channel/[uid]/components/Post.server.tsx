import Image from 'next/image';

interface PostProps {
  nickname: string;
  content: string;
  img_url: string | null;
  profile_img: string | null;
}

const Post = (props: PostProps) => {
  const { nickname, content, img_url, profile_img } = props;
  const defaultImage = '/channelPage/blank_profile.svg';

  return (
    <div className="flex items-start w-full h-48 p-4 bg-gray-50 rounded-lg cursor-pointer">
      <div className="flex flex-col flex-shrink-0 w-12 h-12 rounded-full bg-white shadow-md text-sm mr-2 relative ">
        <Image
            src={profile_img || defaultImage}
            alt="프로필 이미지"
            layout="fill"
            objectFit="cover" 
            className="rounded-full"
          />
      </div>
      
      <div className="flex flex-col flex-wrap">
        <p className="text-m font-black">{nickname}</p>
        <div className="text-m w-full h-32 overflow-hidden break-words mt-2">
          {content}
        </div>
      </div>

      {img_url && (
        <div className="relative ml-auto w-[160px] h-[160px]">
          <Image
            src={img_url}
            alt="미리 보기"
            fill
            unoptimized
            className="rounded-2xl border object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default Post;
