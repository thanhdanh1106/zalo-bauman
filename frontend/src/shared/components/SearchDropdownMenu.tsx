import { metaProps } from '@shared/types/meta';
import { postProps } from '@shared/types/post';
import { filterProps } from '@shared/types/query';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { IoCheckmark } from 'react-icons/io5';
import { ShimmerText } from 'react-shimmer-effects';
import InlineSearchForm from './InlineSearchForm';

type Props = {
  getApi: (
    params: filterProps
  ) => Promise<{ data: postProps[]; meta: metaProps }>;
  onChange: (value: postProps | null) => void;
  button: (state: { open: boolean }) => React.ReactNode;
};

const SearchDropdownMenu = (props: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { getApi, button, onChange } = props;
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<postProps[] | null>(null);
  const [selected, setSelected] = useState<postProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageInit, setPageInit] = useState(false);

  const close = () => setOpen(false);

  const [filter, setFilter] = useState<filterProps>({
    search: '',
    order: 'desc',
    start_date: null,
    end_date: null,
    paged: 1,
    per_page: 12,
    filter: 'popular',
  });

  async function handleFindManyData() {
    try {
      setIsLoading(true);
      const response = await getApi(filter);
      if (response) {
        const { data, meta } = response;
        setOptions(data);
      }
    } finally {
      setIsLoading(false);
      setPageInit(true);
    }
  }

  useEffect(() => {
    if (!pageInit && open) {
      handleFindManyData();
    }
  }, [open]);

  useEffect(() => {
    if (pageInit) {
      handleFindManyData();
    }
  }, [filter]);

  function handleSelect(value: postProps) {
    setSelected(value);
    onChange(value);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        close();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative" tabIndex={0}>
      <div className="cursor-pointer" onClick={() => setOpen(!open)}>
        {button({ open })}
      </div>
      {open ? (
        <div className="absolute z-[2] bg-white   rounded-lg max-h-[280px] overflow-auto border border-slate-300 w-full top-[calc(100%+10px)]">
          <div className="sticky p-2 top-0 bg-white  z-[2]">
            <InlineSearchForm
              loading={isLoading}
              onSearch={(value) => setFilter({ ...filter, search: value })}
            />
          </div>
          <div className="relative p-3 space-y-2 text-sm">
            {isLoading ? (
              <ShimmerText line={8} />
            ) : Array.isArray(options) && options.length ? (
              options.map((val) => (
                <div
                  key={val.id}
                  onClick={() => {
                    handleSelect(val);
                    close();
                  }}
                  className={classNames({
                    'menu-item-smaller flex ju cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100  duration-300':
                      true,
                  })}
                >
                  <p className="flex-1 ">{val.title}</p>
                  {selected?.id == val.id && (
                    <IoCheckmark className="text-green-600" />
                  )}
                </div>
              ))
            ) : (
              ''
            )}
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default SearchDropdownMenu;


