import { filterProps } from '@shared/types/query';
import {
  FormControl,
  FormLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Dispatch,
  SetStateAction,
  Suspense,
  useCallback,
  useState,
} from 'react';

import SearchIcon from '@mui/icons-material/Search';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';

const FilterTable = ({
  filter,
  setFilter,
}: {
  filter: filterProps;
  setFilter: Dispatch<SetStateAction<filterProps>>;
}) => {
  const [searchValue, setSearchValue] = useState(filter.search);
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [orderBy, setOrderBy] = useState('desc');
  const { t } = useTranslation();

  const handleChangeSearch = useCallback(
    (value: string) => {
      setFilter((prev) => ({ ...prev, search: value }));
    },
    [setFilter]
  );

  const handleChangeStartDate = useCallback(
    (value: Dayjs | null) => {
      setStartDate(value);
      const dateValue = value ? value.format('DD/MM/YYYY') : '';
      setFilter((prev) => ({ ...prev, start_date: dateValue }));
    },
    [setFilter]
  );

  const handleChangeEndDate = useCallback(
    (value: Dayjs | null) => {
      setEndDate(value);
      const dateValue = value ? value.format('DD/MM/YYYY') : '';
      setFilter((prev) => ({ ...prev, end_date: dateValue }));
    },
    [setFilter]
  );

  const handleChangeOrder = useCallback(
    (value: string) => {
      setOrderBy(value);
      setFilter((prev) => ({ ...prev, order: value }));
    },
    [setFilter]
  );

  return (
    <Suspense>
      <form>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <FormControl sx={{ flex: 1 }}>
            <FormLabel sx={{ mb: 1, fontSize: 14 }}>
              {t('Search for keywords')}
            </FormLabel>
            <TextField
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              size="small"
              sx={{
                width: '100%',
                paddingLeft: '0px !important',
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment sx={{ mr: 3 }} position="start">
                    <IconButton onClick={() => handleChangeSearch(searchValue)}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel sx={{ mb: 1, fontSize: 14 }}>{t('From date')}</FormLabel>
            <DatePicker
              slotProps={{ textField: { size: 'small' } }}
              value={startDate}
              onChange={(value) => handleChangeStartDate(value)}
              sx={{
                width: '100%',
                '& .MuiSvgIcon-root': {
                  width: 20,
                  height: 20,
                },
                '& .MuiButtonBase-root': {
                  border: 'unset',
                  background: 'unset',
                },
              }}
            />
          </FormControl>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel sx={{ mb: 1, fontSize: 14 }}>{t('To date')}</FormLabel>
            <DatePicker
              slotProps={{ textField: { size: 'small' } }}
              value={endDate}
              minDate={startDate ? startDate : dayjs()}
              onChange={(value) => handleChangeEndDate(value)}
              sx={{
                width: '100%',
                '& .MuiSvgIcon-root': {
                  width: 20,
                  height: 20,
                },
                '& .MuiButtonBase-root': {
                  border: 'unset',
                  background: 'unset',
                },
              }}
            />
          </FormControl>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel sx={{ mb: 1, fontSize: 14 }}>{t('Order')}</FormLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label=""
              value={orderBy}
              size="small"
              onChange={(e) => handleChangeOrder(e.target.value)}
              sx={{ width: '100%' }}
            >
              <MenuItem value={'desc'}>Desc</MenuItem>
              <MenuItem value={'asc'}>Asc</MenuItem>
            </Select>
          </FormControl>
        </div>
      </form>
    </Suspense>
  );
};

export default FilterTable;


