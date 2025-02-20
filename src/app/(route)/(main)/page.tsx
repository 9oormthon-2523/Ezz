'use client';

// components
import Header from '../../_components/Header/Header.server';
import NavBar from './_components/NavBar/NavBar.client';
import StreamList from '@/app/_components/StreamList/StreamList.server';
import SkeletonStreamList from '@/app/_components/StreamList/skeletonUI/SkeletonStreamList';
import StreamComponent from '@/app/_components/StreamList/StreamComponent';
// hooks
import { useFetchStreamData } from '@/app/_hooks/streamList/useFetchStreamData';

export default function Home() {
  return (
    <div>
      <Header />
      <NavBar />
      <div className="text-[22px] py-[90px] pl-[70px] pr-[20px] max-w-[2060px]">
        <div className="px-4 pt-4 flex justify-between">
          <strong className="font-blackHanSans font-thin ">추천 Live</strong>
        </div>
        <StreamComponent />
      </div>
    </div>
  );
}
