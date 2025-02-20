'use client';

import React, { ReactNode, useCallback, useEffect } from 'react';
import useAudienceCnt from '@/app/_hooks/studio/audience/useAudienceCnt';
import useStreamCleanup from '@/app/_hooks/studio/client/useStreamCleanup.client';
import { useUID } from '@/app/_store/context/useUid';
import useStudioManager from '@/app/_hooks/studio/useStudioManager.client';

const BeforeUnloadWrapper = ({ children }: { children: ReactNode }) => {
  const uid = useUID();
  const { clientRef } = useStudioManager(uid);
  const { deactivateChannel } = useAudienceCnt({ host_uid: uid });
  const { handleStreamClose, clientReset } = useStreamCleanup(uid, clientRef);

  const handleClear = useCallback(
    (e: BeforeUnloadEvent) => {
      e.preventDefault();

      deactivateChannel();
      handleStreamClose();
      clientReset();
    },
    [deactivateChannel, handleStreamClose, clientReset],
  );

  useEffect(() => {
    window.addEventListener('beforeunload', handleClear);

    return () => {
      window.addEventListener('beforeunload', handleClear);
    };
  }, [handleClear]);

  return <>{children}</>;
};

export default BeforeUnloadWrapper;
