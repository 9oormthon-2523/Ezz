'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface Props {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
  menuRoute?: string;
  gap?: number;
  px?: number;
  py?: number;
  fontSize?: number;
  color: 'black' | 'gray' | 'blue';
  isFold?: boolean;
}

const MenuButtonBox = (props: Props) => {
  const { icon, text, onClick, menuRoute, px, py, gap, fontSize, color, isFold } = props;

  const [isMatchDomain, setIsMatchDomain] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (menuRoute && menuRoute === pathname) setIsMatchDomain(true);
    else setIsMatchDomain(false);
  }, [menuRoute, pathname]);

  const fontColor = {
    black: 'text-[#222222]',
    gray: 'text-[#525662]',
    blue: 'text-[#4e41db]',
  };

  return (
    <button
      className={`w-full flex p-[10px] hover:bg-[#f5f6f8] rounded-[5px] items-center ${fontColor[color]}`}
      style={{
        padding: `${py}px ${px}px`,
        fontSize: `${fontSize}px`,
      }}
      onClick={onClick}
    >
      {icon}
      <span
        className="flex transition-all duration-200 ease-in-out whitespace-nowrap overflow-hidden leading-none"
        style={{
          opacity: isFold ? '0' : '1',
          marginLeft: isFold ? '0px' : `${gap}px`,
          width: isFold ? '0px' : `137px`,
          color: isMatchDomain ? '#4e41db' : 'inherit',
        }}
      >
        {text}
      </span>
    </button>
  );
};

export default MenuButtonBox;
