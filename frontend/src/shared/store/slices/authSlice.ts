import { sessionProps } from '@shared/types/auth';
import { userProps } from '@shared/types/user';
import { deleteCookie, setCookie } from '@shared/utils/Hooks';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: userProps | null;
  loading: boolean;
  error: string | null;
  status: 'idle' | 'loading' | 'loaded'
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  status: 'idle'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.status = 'loading';
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<sessionProps>) {
      state.loading = false;
      state.error = null;
      state.status = 'loaded';
      state.user = action.payload.user;
      setCookie('li_at', action.payload.credentials.access_token, action.payload.credentials.expires_in);
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.user = null;
      state.error = action.payload;
      state.status = 'loaded';
    },
    logout(state) {
      state.user = null;
      state.error = null;
      state.status = 'loaded';
      deleteCookie('li_at');
    },
    setUser(state, action: PayloadAction<userProps>) {
      state.user = action.payload;
      state.status = 'loaded';
    },
    setStatus(state, action: PayloadAction<"loading" | "idle" | "loaded">) {
       state.status = action.payload;
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setUser, setStatus } = authSlice.actions;
export default authSlice.reducer;