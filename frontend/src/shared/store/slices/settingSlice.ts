import { mediaProps } from '@shared/types/media';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingProps {
  enable_top_header: boolean;
  top_header_hotline: string | null;
  top_header_email: string | null;
  top_header_notify: string | null;
  top_header_button: string | null;
  top_header_button_label_color: string | null;
  top_header_button_background_color: string | null;
  menu_item: MenuItem[];
  header_logo: mediaProps | null;
  header_logo_dark: mediaProps | null;
  footer_logo: mediaProps | null;
  footer_description: string | null;
  email_marketing_title: string | null;
  address: string | null;
  hotline: string | null;
  working_hour: string | null;
  menu_1: Menu | null;
  menu_2: Menu | null;
  menu_3: Menu | null;
  menu_4: Menu | null;
  email: string | null;
}

export interface Menu {
  title: string;
  menu_item: MenuItem[];
}

export interface MenuItem {
  title: string;
  url: string;
  sub_item: any[];
}

const initialState: SettingProps = {
  enable_top_header: false,
  top_header_hotline: null,
  top_header_email: null,
  top_header_notify: null,
  top_header_button: null,
  top_header_button_label_color: null,
  top_header_button_background_color: null,
  menu_item: [],
  header_logo: null,
  header_logo_dark: null,
  footer_logo: null,
  footer_description: null,
  email_marketing_title: null,
  address: null,
  hotline: null,
  working_hour: null,
  menu_1: null,
  menu_2: null,
  menu_3: null,
  menu_4: null,
  email: null,
};

const SettingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    setSettings(state, action: PayloadAction<SettingProps>) {
       Object.assign(state, action.payload);
    },
  },
});

export const { setSettings } = SettingSlice.actions;
export default SettingSlice.reducer;