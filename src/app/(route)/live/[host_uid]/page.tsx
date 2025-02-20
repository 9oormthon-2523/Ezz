import StreamingPage from "./widget/_StreamingPage.client";
import { redirect } from "next/navigation";
import { createClient } from '@/app/_utils/supabase/server';
import { getLiveInit } from "@/app/_utils/live/db/getLiveInit.server";

export default async function Page({ params }: { params: Promise<{ host_uid: string }> }) { 
  const { host_uid } = await params;
  const supabase = await createClient();  
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const dto = await getLiveInit(host_uid);

  if (!dto) redirect("/");

  const initDto =  {
    ...dto,
    streamRoom:{
      host_uid,
      client_uid : user ? user.id: null,
      ...dto.streamRoom,
    },
  };


  return (
    <>
      <StreamingPage {...initDto}/>
    </>
  );
};
