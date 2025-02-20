'use client';

import React, { useState } from 'react';
import HeaderButton from './HeaderButton.client';
import ProfileMenuList from './ProfileMenu.server';
import OutsideClickDetector from '@/app/_components/OutsideClickWrapper.client';
import { User } from './Header.server';

export interface ProfileProps {
  uid: string;
  user: User;
}

const ProfileButton = (props: ProfileProps) => {
  const { uid, user } = props;
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);

  return (
    <div className="relative">
      <HeaderButton
        id="ignored-header"
        imageSrc={user.profile_img || '/userImage.webp'}
        desc={'내 프로필'}
        width={30}
        height={30}
        padding={5}
        onClick={() => setIsOpenMenu((prev) => !prev)}
      />

      {isOpenMenu && (
        <OutsideClickDetector
          ignoreIds={['ignored-header']}
          action={() => setIsOpenMenu(false)}
        >
          <ProfileMenuList uid={uid} user={user} />
        </OutsideClickDetector>
      )}
    </div>
  );
};

export default ProfileButton;
