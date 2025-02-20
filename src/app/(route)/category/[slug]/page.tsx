'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';

// components
import Header from '@/app/_components/Header/Header.server';
import NavBar from '../../(main)/_components/NavBar/NavBar.client';
import StreamComponent from '@/app/_components/StreamList/StreamComponent';

// data
import { categories } from '../categoriesData';

export interface Category {
  id: number;
  name: string;
  slug: string;
  backgroundImage: string;
}

const CategoryPage = () => {
  const { slug } = useParams();
  const categoryData = categories.find((category) => category.slug === slug);

  return (
    <div>
      <Header />
      <NavBar />
      <div className="text-[22px] py-[90px] pl-[70px] pr-[20px] max-w-[2060px]">
        <div className="px-8 pt-4 flex justify-between bg-white rounded-lg p-6">
          {categoryData ? (
            <div className="flex items-center gap-4">
              <Image
                src={categoryData.backgroundImage}
                alt={categoryData.name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-lg object-cover shadow-md"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{categoryData.name}</h2>
                <p className="text-sm text-gray-500">관련 스트림을 확인하세요!</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">카테고리를 찾을 수 없습니다.</p>
          )}
        </div>

        <StreamComponent slug={slug} />
      </div>
    </div>
  );
};

export default CategoryPage;
