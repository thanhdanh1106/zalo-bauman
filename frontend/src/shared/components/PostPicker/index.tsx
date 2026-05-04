import { findManyProps } from "@shared/types/api";
import { PickerProps } from "@shared/types/picker";
import { filterProps } from "@shared/types/query";
import { getThumbnailUrl } from "@shared/utils/Hooks";
import { useDebouncedValue } from "@shared/utils/useDebouncedValue";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import UserAvatar from "../UserAvatar";

interface PostPickerProps {
  name?: string;
  size?: string;
  defaultData?: PickerProps | null;
  defautSearchParams?: filterProps;
  getApi: findManyProps;
  onChange: (value: PickerProps | null) => void;
  valueKey: string;
  optionKey: string;
  previewKey: string | null;
  error?: string[] | null | undefined;
  required?: boolean;
  children?: React.ReactNode;
}

const PostPicker: React.FC<PostPickerProps> = ({
  defaultData,
  defautSearchParams = {},
  getApi,
  onChange,
  valueKey = "id",
  optionKey,
  previewKey = "title",
}) => {
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<PickerProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageInit, setPageInit] = useState(false);
  const searchDebounce = useDebouncedValue(search, 800);

  async function handleGetData(params: filterProps) {
    try {
      setLoading(true);
      const response = await getApi(params);
      if (response && !response.error) {
        const { data } = response;
        if (Array.isArray(data) && data.length) {
          setOptions(data);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function handleChangeData(value: PickerProps | null) {
    onChange(value);
  }

  useEffect(() => {
    if (!defaultData) {
      handleGetData({});
    }
    setPageInit(true);
  }, []);

  useEffect(() => {
    if (pageInit) {
      handleGetData({
        search: searchDebounce,
        ...defautSearchParams,
      });
    }
    setPageInit(true);
  }, [searchDebounce]);

  return (
    <Autocomplete
      id="combo-box-demo"
      size="small"
      options={options}
      defaultValue={defaultData ? defaultData : null}
      getOptionLabel={(option) =>
        String(option[optionKey as keyof PickerProps])
      }
      getOptionKey={(option) => String(option[valueKey as keyof PickerProps])}
      onChange={(e: React.SyntheticEvent, value: PickerProps | null) => {
        handleChangeData(value);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Type to search"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: defaultData?.thumbnail ? (
              <div className="border flex items-center justify-center border-slate-200 rounded w-8 h-8 aspect-square">
                <img
                  className=""
                  src={getThumbnailUrl(defaultData.thumbnail)}
                />
              </div>
            ) : defaultData?.information ? (
              <div>
                <UserAvatar data={defaultData} />
              </div>
            ) : null,
            endAdornment: (
              <Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{
            display: "flex",
            py: 1,
            gap: 1,
          }}
          {...props}
        >
          <Box className="flex gap-3 items-center">
            {option?.thumbnail ? (
              <div className="border flex items-center justify-center border-slate-200 rounded w-14 h-10 aspect-video">
                <img className="" src={getThumbnailUrl(option.thumbnail)} />
              </div>
            ) : (
              ""
            )}
            {option?.information ? (
              <div>
                <UserAvatar data={option} />{" "}
              </div>
            ) : null}
            <div className="flex-1">
              {(option as any)[optionKey] || "Unnamed Option"}{" "}
              {previewKey && option[previewKey as keyof PickerProps]
                ? `(${String(option[previewKey as keyof PickerProps])})`
                : ""}
              <p className="text-xs ">
                {defaultData?.roles?.length ? defaultData?.roles[0]?.title : ""}
              </p>
              <p className="text-xs ">
                {defaultData?.status ? defaultData?.status : ""}
              </p>
            </div>
          </Box>
        </Box>
      )}
    />
  );
};

export default PostPicker;


