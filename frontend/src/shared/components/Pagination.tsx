import { metaProps } from '@shared/types/meta';
import { TablePagination } from '@mui/material';
import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { filterProps } from '../types/query';

const Pagination = ({
  meta,
  onChange,
}: {
  meta: metaProps;
  onChange: (data: { paged?: number; per_page?: number }) => void;
}) => {
  const { total, per_page, current_page } = meta;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Hàm chung để cập nhật query params
  const updateQueryParams = useCallback(
    (newParams: Partial<filterProps>) => {
      const params = new URLSearchParams(searchParams);
      Object.entries(newParams).forEach(([key, value]) => {
        console.log(key, value);
        if (value === '' || value === null) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      setSearchParams(params);
      navigate(`?${params.toString()}`);
    },
    [navigate, searchParams, setSearchParams]
  );

  const handleChangePage = (value: number | null) => {
    const newPage = value ? value + 1 : 1;
    onChange({ paged: newPage });
  };

  const handleChangeRowsPerPage = (value: number) => {
    onChange({ per_page: value });
  };

  return (
    <TablePagination
      labelRowsPerPage={'Per page:'}
      rowsPerPageOptions={[12, 24, 36]}
      component="div"
      count={total || 0}
      rowsPerPage={per_page || 12}
      page={current_page ? current_page - 1 : 0}
      onPageChange={(event, value) => handleChangePage(value)}
      onRowsPerPageChange={(event) =>
        handleChangeRowsPerPage(Number(event.target.value))
      }
    />
  );
};

export default Pagination;


