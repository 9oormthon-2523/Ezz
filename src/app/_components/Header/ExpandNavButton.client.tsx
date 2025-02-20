'use client';

import React, { useEffect } from 'react';
import HeaderButton from './HeaderButton.client';
import useNavToggle from '@/app/_store/stores/main/useNavToggle.client';
const ExpandNavButton = () => {
  const { isOpen, toggle } = useNavToggle();
  useEffect(() => {
    console.log(isOpen);
  }, [isOpen]);

  return (
    <HeaderButton
      imageSrc={'/studioPage/Hamburger.svg'}
      desc={isOpen ? '메뉴 확장' : '메뉴 접기'}
      width={40}
      height={40}
      onClick={toggle}
    />
  );
};

export default ExpandNavButton;
