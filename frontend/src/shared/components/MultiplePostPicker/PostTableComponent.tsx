import { filterProps } from '@shared/types/query';
import { HeadCellsProps } from '@shared/types/table';
import {
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';

import { useToggleSelection } from '@shared/hooks/useToggleSelection';
import { metaProps } from '@shared/types/meta';
import { PickerProps } from '@shared/types/picker';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import EnhancedTableHead from '../EnhancedTableHead';
import ImageCell from '../ImageCell';
import Pagination from '../Pagination';

import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

interface PostTableProps {
  handleSelect: (media: PickerProps | PickerProps[]) => void;
  defaultData?: PickerProps[];
  getApi: (params: filterProps) => Promise<{
    error: boolean;
    data: PickerProps[];
    meta: metaProps;
    message: string;
  }>;
  multiple?: boolean;
}

const PostTableComponent = ({
  handleSelect,
  getApi,
  multiple,
  defaultData,
}: PostTableProps) => {
  const { t } = useTranslation();
  const [data, setData] = useState<PickerProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { selected, toggle, selectAll, clearAll } = useToggleSelection();
  const [meta, setMeta] = useState<metaProps>({
    total: 0,
    current_page: 0,
    from: 0,
    last_page: 0,
    per_page: 0,
  });
  const [filter, setFilter] = useState<filterProps>({
    search: '',
    order: 'desc',
    paged: 1,
    per_page: 12,
    start_date: null,
    end_date: null,
  });

  async function handleGetData(params: filterProps) {
    try {
      setIsLoading(true);
      const response: {
        error: boolean;
        data: PickerProps[];
        meta: metaProps;
        message: string;
      } = await getApi(params);
      if (response && !response.error) {
        const { data, meta } = response;
        if (Array.isArray(data) && data.length) {
          setData(data);
          setMeta(meta);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    handleGetData(filter);
  }, [filter]);

  const handleClick = (event: React.SyntheticEvent, id: number) => {
    toggle(id);
  };

  const handleSelectAllClick = (event: React.SyntheticEvent) => {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      selectAll(data.map((item) => item.id));
    } else {
      clearAll();
    }
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  function handleSelectMultipleData() {
    const selectedData = data.filter((val) => selected.includes(val.id));
    handleSelect(selectedData);
  }

  useEffect(() => {
    if (Array.isArray(defaultData) && defaultData?.length) {
      defaultData.map((val) => toggle(val.id));
    }
  }, [defaultData]);

  const headCells: HeadCellsProps[] = [
    {
      id: 'thumbnail',
      label: 'Thumbnail',
    },
    {
      id: 'type',
      label: 'Content',
    },
    {
      id: 'actions',
      label: 'Actions',
    },
  ];

  interface ToolbarProps {
    numSelected: number;
    onSubmit: () => void;
  }

  const EnhancedTableToolbar = (props: ToolbarProps) => {
    const { numSelected, onSubmit } = props;
    const { t } = useTranslation();
    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        {numSelected > 0 ? (
          <>
            <p>
              {numSelected} {t('selected')}
            </p>
            <Tooltip title="Delete">
              <Button onClick={onSubmit}>{t('Select')}</Button>
            </Tooltip>
          </>
        ) : (
          ''
        )}
      </Toolbar>
    );
  };

  return (
    <Fragment>
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          value={filter?.search}
          placeholder="Search for keyword..."
          size="small"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFilter({ ...filter, search: e.target.value })
          }
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    loading={isLoading}
                    onClick={() => handleGetData(filter)}
                  >
                    <IoSearchOutline />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
      <Paper>
        <TableContainer
          sx={{
            maxHeight: 'calc(100vh - 300px)',
            maxWidth: 'calc(100vw - 54px)',
          }}
        >
          <Table stickyHeader aria-label="sticky table" size="medium">
            <EnhancedTableHead
              headCells={headCells}
              numSelected={selected.length}
              multiple={multiple}
              onSelectAllClick={handleSelectAllClick}
              rowCount={data.length}
            />
            {Array.isArray(data) && data?.length ? (
              <TableBody>
                {Array.isArray(data) && data.length
                  ? data.map((row, index) => {
                      const { id, title, thumbnail } = row;
                      const isItemSelected = isSelected(id);
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row?.id}
                          sx={{ cursor: 'pointer' }}
                        >
                          {multiple ? (
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                onClick={(event) => handleClick(event, row?.id)}
                                inputProps={{
                                  'aria-labelledby': labelId,
                                }}
                              />
                            </TableCell>
                          ) : (
                            ''
                          )}
                          <TableCell>
                            <ImageCell data={thumbnail} />
                          </TableCell>
                          <TableCell>
                            <h3 className="font-bold mb-2">{title}</h3>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="text"
                              onClick={() => handleSelect(row)}
                            >
                              {t('Select')}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  : ''}
              </TableBody>
            ) : null}
          </Table>
        </TableContainer>
        {selected.length ? (
          <EnhancedTableToolbar
            numSelected={selected.length}
            onSubmit={() => handleSelectMultipleData()}
          />
        ) : (
          ''
        )}
        <Pagination
          meta={meta}
          onChange={(value) => setFilter((filter) => ({ ...filter, ...value }))}
        />
      </Paper>
    </Fragment>
  );
};

export default PostTableComponent;


