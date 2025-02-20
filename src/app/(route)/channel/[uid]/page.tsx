'use client';
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Post from "./components/Post.server";
import BoardInput from "./components/BoardInput.client";
import { useLoggedInUser } from "@/app/_hooks/channel/useLoggedInUser";
import { useChannelPosts } from "@/app/_hooks/channel/useChannelPosts";

const Channel = () => {
  const router = useRouter();
  const { uid } = useParams();
  const loggedInUserId = useLoggedInUser();
  const posts = useChannelPosts(uid as string);

  return (
    <>
      <div className="ml-4 w-10/12">
        {loggedInUserId === uid && <BoardInput />}
        <div className="flex w-full flex-col-reverse bg-white rounded-lg mt-6 gap-6">
          {posts.length === 0 ? (
            <div className="flex flex-col justify-center items-center my-20 pt-10">
              <Image
                src="/channelPage/no_content.svg"
                alt="No content"
                width={140}
                height={140}
              />
              <p className="text-md font-bold">
                이 채널의 커뮤니티는 너무 조용해요...
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                onClick={() =>
                  router.push(`/channel/${uid}/detail/${post.id}`)
                }
              >
                <Post
                  nickname={post.nickname}
                  content={post.content}
                  img_url={post.img_url}
                  profile_img={post.profile_img}
                />
              </div>
            ))
          )}
        </div>
      </div>
      <div className="h-32" />
    </>
  );
};

export default Channel;
