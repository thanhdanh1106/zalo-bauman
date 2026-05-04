import { useToasterContext } from '@shared/components/ToasterContext';
import ServiceCard from '@/Templates/Service/ServiceCard';
import { metaProps } from '@shared/types/meta';
import { postCategoryProps, postProps } from '@shared/types/post';
import { filterProps } from '@shared/types/query';
import { filterParams } from '@shared/utils/Hooks';
import { findManyServices } from '@shared/utils/Services';
import { Pagination } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// Main App Component (Blog Page)
const ServicePosts: React.FC = () => {
  const { showMessage, startProgress, completeProgress } = useToasterContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageInit, setPageInit] = useState(false);
  const [data, setData] = useState<postProps[]>([]);
  const [postCategories, setPostCategories] = useState<
    postCategoryProps[] | null
  >(null);

  const [filter, setFilter] = useState<filterProps>({
    search: searchParams.get('search') || '',
    order: searchParams.get('order') || 'desc',
    start_date: searchParams.get('start_date') || null,
    end_date: searchParams.get('end_date') || null,
    paged: Number(searchParams.get('paged')) || 1,
    per_page: Number(searchParams.get('per_page')) || 12,
  });

  const [meta, setMeta] = useState<metaProps>({
    total: 0,
    current_page: 0,
    from: 0,
    last_page: 0,
    per_page: 0,
  });

  const handleFindManyData = async (filter: Record<string, any>) => {
    try {
      startProgress();
      const query = filterParams(filter);
      setSearchParams(query);
      const response = await findManyServices(query);
      if (response && !response.error) {
        const { data, meta } = response;
        setData(data);
        setMeta(meta);
      }
      setPageInit(true);
    } finally {
      completeProgress();
    }
  };

  const handleFindManyCategoryData = async (filter: Record<string, any>) => {
    try {
      startProgress();
      setSearchParams(filter);
      const response = await findManyServices(filter);

      if (response && !response.error) {
        const { data, meta } = response;
        setData(data);
        setMeta(meta);
      }
      setPageInit(true);
    } finally {
      completeProgress();
    }
  };

  useEffect(() => {
    handleFindManyData(filter);
  }, []);

  useEffect(() => {
    if (pageInit) {
      handleFindManyData(filter);
    }
  }, [filter]);

  useEffect(() => {
    handleFindManyCategoryData({});
  }, []);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setFilter({ ...filter, paged: value });
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {Array.isArray(data) && data.length
          ? data.map((post) => <ServiceCard key={post.id} data={post} />)
          : ''}
      </div>
      {meta.last_page > 0 ? (
        <div className="col-span-2 flex justify-center mt-5">
          <Pagination count={meta.last_page || 0} onChange={handleChange} />
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default ServicePosts;


