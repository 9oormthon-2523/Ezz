'use client';
import React from 'react';
import useNavToggle from '@/app/_store/main/useNavToggle.client';
import { IoHome } from 'react-icons/io5';
import { TbChartBarPopular } from 'react-icons/tb';
import { BiSolidCategory } from 'react-icons/bi';
import { useRouter } from 'next/navigation';
const NavBar = () => {
  const { isOpen, toggle } = useNavToggle();
  const router = useRouter();
  const moveToURL = (url: string) => {
    router.push(url);
  };
  const renderdata = isOpen ? (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-[#222] text-white transform z-30 mt-[60px] ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`}
    >
      <button onClick={toggle} className="text-white p-2 absolute top-2 right-2">
        X
      </button>

      <nav className="p-4">
        <ul>
          <li
            className="mb-4 hover:text-gray-400 cursor-pointer flex items-center gap-2"
            onClick={() => moveToURL('/')}
          >
            <IoHome />홈
          </li>
          <li className="mb-4 hover:text-gray-400 cursor-pointer flex items-center gap-2">
            <TbChartBarPopular />
            인기
          </li>
          <li
            className="mb-4 hover:text-gray-400 cursor-pointer flex items-center gap-2"
            onClick={() => moveToURL('/category')}
          >
            <BiSolidCategory />
            카테고리
          </li>
        </ul>
      </nav>
    </div>
  ) : (
    <div className={`fixed top-0 left-0 px-[10px] h-full w-16 bg-[#222] text-white transform z-30 mt-[60px]`}>
      <nav className="p-4">
        <ul>
          <li
            className="mb-4 hover:text-gray-400 cursor-pointer text-[17px] flex flex-col items-center"
            onClick={() => moveToURL('/')}
          >
            <IoHome />
            <span className="text-[10px] mt-[2px]">홈</span>
          </li>
          <li className="mb-4 hover:text-gray-400 cursor-pointer text-[17px] flex flex-col items-center">
            <TbChartBarPopular />
            <span className="text-[10px] w-10 flex justify-center mt-[2px]">인기</span>
          </li>
          <li
            className="mb-4 hover:text-gray-400 cursor-pointer text-[17px] flex flex-col items-center "
            onClick={() => moveToURL('/category')}
          >
            <BiSolidCategory />
            <span className="text-[10px] w-10 flex justify-center mt-[2px]">카테고리</span>
          </li>
        </ul>
      </nav>
    </div>
  );

  return <>{renderdata}</>;
};

export default NavBar;
