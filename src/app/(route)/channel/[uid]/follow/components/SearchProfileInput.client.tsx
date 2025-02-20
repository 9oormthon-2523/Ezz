'use client';

import React from 'react';
import SearchIcon from '@public/studioPage/Search.svg';

interface SearchInputProps {
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  placeholder = "검색",
  onChange,
}) => {
  return (
    <div className="relative w-1/3 mb-4">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="border rounded px-3 py-2 w-full pr-10 focus:outline-none focus:border-[#1bb373]"
      />
      <div className="absolute inset-y-0 right-3 flex items-center">
        <SearchIcon className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
};

export default SearchInput;
