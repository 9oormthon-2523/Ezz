import { useEffect, useState } from "react";
import { createClient } from "../../_utils/supabase/client";

export const useLoggedInUser = () => {
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoggedInUserId = async () => {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("로그인된 사용자 정보 불러오기 오류", error);
      } else {
        setLoggedInUserId(user?.id || null);
      }
    };

    fetchLoggedInUserId();
  }, []);

  return loggedInUserId;
};
