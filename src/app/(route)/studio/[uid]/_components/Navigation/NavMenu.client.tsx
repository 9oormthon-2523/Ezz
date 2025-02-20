'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import MenuButtonBox from '../common/MenuButtonBox.client';
import ArrowDownIcon from '@public/studioPage/ArrowDown.svg';
import ArrowUpIcon from '@public/studioPage/ArrowUp.svg';
import useNavSizeToggle from '@/app/_store/stores/studio/useNavSizeToggle.client';
import '@/app/_styles/studioPage.css';
import SubMenus from './SubMenus';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { getMenuList } from '@/app/_utils/studio/getMenuList';
import { useUID } from '@/app/_store/context/useUid';

interface Props {
  menuName: string;
  icon: ReactNode;
  menuRoute?: string;
}

const NavMenu = (props: Props) => {
  const { menuName, icon, menuRoute } = props;

  const uid = useUID();
  const router = useRouter();
  const pathname = usePathname();
  const { isFold, toggle } = useNavSizeToggle();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  useEffect(() => {
    if (isFold) setIsOpen(false);
  }, [isFold]);

  return (
    <div className="flex flex-col relative group">
      <li className="flex items-center py-[1px] px-[10px] box-border font-blackHanSans text-[15px]">
        <MenuButtonBox
          icon={icon}
          text={menuName}
          menuRoute={menuRoute}
          color={
            getMenuList(uid)
              [menuName].map((item) => item.route)
              .includes(pathname) && !isOpen
              ? 'blue'
              : 'black'
          }
          px={15}
          py={10}
          gap={10}
          onClick={() => {
            if (menuRoute) {
              router.push(`${menuRoute}`);
            } else {
              if (isFold) toggle();
              setIsOpen((prev) => !prev);
            }
          }}
          isFold={isFold}
        />

        {!isFold && !menuRoute && (
          <button className="absolute right-[25px]" onClick={() => setIsOpen((prev) => !prev)}>
            {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </button>
        )}
      </li>

      {/* 서브 메뉴들이 존재하면서 열려있을때 서브메뉴 렌더링 */}
      {!menuRoute && isOpen && <SubMenus menuName={menuName} />}

      {/* 네비게이션이 접혔을때, hover시 description 띄우기 */}
      {isFold && (
        <span className="absolute transform top-1/2 -translate-y-1/2 right-1/4 translate-x-full group-button-desc rounded-md hover-opacity">
          {menuName}
        </span>
      )}
    </div>
  );
};

export default NavMenu;
