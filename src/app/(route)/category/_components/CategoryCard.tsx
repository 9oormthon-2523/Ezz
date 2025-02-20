import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
interface Category {
  id: number;
  name: string;
  slug: string;
  backgroundImage: string;
}

const CategoryCard: React.FC<{ category: Category }> = ({ category }) => {
  const router = useRouter();

  return (
    <div
      key={category.id}
      className="cursor-pointer rounded-lg overflow-hidden relative group"
      onClick={() => router.push(`/category/${category.slug}`)}
    >
      <Image
        src={category.backgroundImage}
        alt={category.name}
        width={330}
        height={160}
        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-lg font-bold">
        {category.name}
      </div>
    </div>
  );
};

export default CategoryCard;
