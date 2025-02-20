import { useEffect, useState } from "react";
import { createClient } from "../../_utils/supabase/client";

type PostType = {
  id: number;
  nickname: string;
  content: string;
  img_url: string | null;
  profile_img: string | null;
  user_id: string;
};

export const useChannelPosts = (uid?: string) => {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    if (!uid || typeof uid !== "string") return;

    const fetchPosts = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("posts")
        .select("id, nickname, content, img_url, user_id")
        .eq("user_id", uid);

      if (error) {
        console.error("글 불러오기 오류", error);
      } else if (data) {
        const postsWithProfileImg = await Promise.all(
          data.map(async (post) => {
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("profile_img")
              .eq("id", post.user_id)
              .single();

            if (userError) {
              console.error("사용자 정보 불러오기 오류", userError);
            }

            return {
              ...post,
              profile_img: userData?.profile_img || null,
            };
          })
        );

        setPosts(postsWithProfileImg || []);
      }
    };

    fetchPosts();
  }, [uid]);

  return posts;
};
