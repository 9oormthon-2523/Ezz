'use client';

//components
import Header from '../../_components/Header/Header.server';
import NavBar from '../(main)/_components/NavBar/NavBar.client';
import CategoryCard from './_components/CategoryCard';

import { categories } from './categoriesData';
import { useRouter } from 'next/navigation';

const Category = () => {
  const router = useRouter();
  return (
    <div>
      <Header />
      <NavBar />
      <div className="text-[22px] py-[90px] pl-[70px] pr-[20px] max-w-[2060px]">
        <div className="px-4 pt-4 flex justify-between">
          <strong className="font-blackHanSans font-thin ">카테고리</strong>
        </div>
        <div className="grid grid-cols-6 gap-4 p-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
