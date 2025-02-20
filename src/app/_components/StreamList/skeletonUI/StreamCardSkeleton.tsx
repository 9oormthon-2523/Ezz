import React from 'react';

const StreamCardSkeleton = () => (
  <div className="bg-white rounded-lg p-2 min-w-[320px] min-h-[300px] animate-pulse">
    <div className="h-44 rounded-lg bg-gray-200"></div>
    <div className="p-2">
      <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
      <div className="flex items-center gap-1 mt-3">
        <div className="w-6 h-6 rounded-full bg-gray-200"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="flex gap-1 mt-3">
        <div className="h-6 bg-gray-200 rounded w-12"></div>
        <div className="h-6 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  </div>
);

export default StreamCardSkeleton;
