import { darkTheme, lightTheme } from '@shared/utils/theme';
import { ThemeProvider } from '@emotion/react';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { initReactI18next } from 'react-i18next';
import LoadingBar from 'react-top-loading-bar';

interface ToasterContextType {
  showMessage: (
    type: 'success' | 'error',
    message: string,
    position?: string
  ) => void;
  startProgress: () => void;
  theme: 'dark' | 'light';
  changeTheme: (value: 'dark' | 'light') => void;
  completeProgress: (done?: boolean) => void;
}

export const ToasterContext = createContext<ToasterContextType | undefined>(
  undefined
);

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') return stored;

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

export const ToasterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const ref = useRef<any>(null);

  const [theme, setTheme] = useState<'dark' | 'light'>(getInitialTheme);

  const themeOption = useMemo(
    () => (theme == 'dark' ? darkTheme : lightTheme),
    [theme]
  );

  i18n
    .use(LanguageDetector)
    .use(HttpApi)
    .use(initReactI18next)
    .init({
      debug: false,
      fallbackLng: 'en',
      supportedLngs: ['en', 'vi'],
      returnNull: false,
      saveMissing: false,
      detection: {
        order: [
          'querystring',
          'cookie',
          'localStorage',
          'navigator',
          'htmlTag',
        ],
        caches: ['cookie', 'localStorage'],
      },

      backend: {
        loadPath: (
          lngs: string | string[],
          namespaces: string | string[]
        ): string => {
          const lng = Array.isArray(lngs) ? lngs[0] : lngs;
          console.log('lng', lng);
          const ns = Array.isArray(namespaces) ? namespaces[0] : namespaces;

          if (lng === 'en') return '';
          return `${
            import.meta.env.VITE_API_URL
          }/api/locales/${lng}/${ns}.json`;
        },
      },

      react: {
        useSuspense: false,
      },
    });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const changeTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  function startProgress() {
    if (ref.current) {
      ref.current.continuousStart(0, 200);
    }
  }

  function completeProgress(done?: boolean) {
    if (ref.current) {
      ref.current.complete();
    }
  }

  const showMessage = (
    type?: 'success' | 'error' | undefined,
    message?: string | undefined,
    position?: string | undefined
  ) => {
    const option: object = {
      position: position || 'bottom-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    };
    switch (type) {
      case 'success':
        toast.success(message ?? '', option);
        break;
      case 'error':
        toast.error(message ?? '', option);
        break;
      default:
        return toast(message ?? '', option);
    }
  };

  return (
    <ToasterContext.Provider
      value={{
        showMessage,
        startProgress,
        completeProgress,
        theme,
        changeTheme,
      }}
    >
      <ThemeProvider theme={lightTheme}>
        <LoadingBar ref={ref} color="#cbb27c" />
        {children}
        <Toaster position="bottom-center" />
      </ThemeProvider>
    </ToasterContext.Provider>
  );
};

export function useToasterContext() {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error('useToasterContext must be used within a ToasterProvider');
  }
  return context;
}


