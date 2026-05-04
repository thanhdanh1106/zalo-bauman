import React from 'react';
import { TbBoxOff } from 'react-icons/tb';

type NotFoundProps = {
  message?: string;
};

const NotFound: React.FC<NotFoundProps> = ({ message = 'No items found.' }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 text-gray-500">
      <TbBoxOff className="text-6xl mb-4 text-gray-400" />
      <h2 className="text-xl font-semibold">{message}</h2>
      <p className="text-sm text-gray-400 mt-2">
        Try adjusting your search or filter.
      </p>
    </div>
  );
};

export default NotFound;


