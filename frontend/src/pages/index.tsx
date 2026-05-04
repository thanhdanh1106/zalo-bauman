import PageLoading from '@shared/components/PageLoading';
import PageNotFound from '@shared/components/PageNotFound';
import { useToasterContext } from '@shared/components/ToasterContext';
import { PageProps } from '@shared/types/page';
import { findOnePageByName } from '@shared/utils/Pages';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import BodyContent from '@shared/components/BodyContent';

type Props = {};

const index = (props: Props) => {
  const { name } = useParams();
  const [data, setData] = useState<PageProps | null>(null);
  const [pageInit, setPageInit] = useState(false);
  const { startProgress, completeProgress } = useToasterContext();

  async function handleGetData(name: string) {
    try {
      startProgress();
      const response: { data: PageProps } = await findOnePageByName(name);
      setData(response?.data);
    } finally {
      setPageInit(true);
      completeProgress();
    }
  }

  useEffect(() => {
    handleGetData(name as string);
  }, [name]);

  if (!pageInit) {
    return <PageLoading height={500} />;
  }
  if (!data) {
    return <PageNotFound />;
  }

  return (
    <div className="container py-5">
      <h1>{data.title}</h1>
      {data?.body && <BodyContent body={data.body} />}
    </div>
  );
};

export default index;


