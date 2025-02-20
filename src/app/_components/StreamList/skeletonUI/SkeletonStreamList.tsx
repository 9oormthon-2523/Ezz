import React from 'react';
import StreamCardSkeleton from './StreamCardSkeleton';
const SkeletonStreamList = () => (
  <div className="px-4">
    <div className="grid grid-cols-[repeat(4,minmax(330px,1fr))] justify-items-center">
      {[...Array(4)].map((_, index) => (
        <StreamCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

export default SkeletonStreamList;
