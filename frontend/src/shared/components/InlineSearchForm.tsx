import { IconButton } from '@mui/material';
import React, { useState } from 'react';
import { IoSearch } from 'react-icons/io5';

type SearchFormProps = {
  onSearch: (query: string) => void;
  defaultValue?: string;
  loading?: boolean;
};

const InlineSearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  defaultValue,
  loading,
}) => {
  const [query, setQuery] = useState(defaultValue || '');

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm   "
      />
      <div className="px-4 py-2 absolute top-0 right-0 flex items-center h-full p-3 text-gray-600 ">
        <IconButton
          type="button"
          size="small"
          onClick={() => onSearch(query)}
          loading={loading}
        >
          <IoSearch className="text-gray-600 " />
        </IconButton>
      </div>
    </div>
  );
};

export default InlineSearchForm;


