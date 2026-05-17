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
    type: 'success' | 'error' | 'warning' | 'info' | string,
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
    type?: 'success' | 'error' | 'warning' | 'info' | string | undefined,
    message?: string | undefined,
    position?: string | undefined
  ) => {
    toast.custom((t) => {
      let icon = "info";
      let iconColor = "text-blue-500";
      
      if (type === 'success') {
        icon = "check_circle";
        iconColor = "text-green-500";
      } else if (type === 'error') {
        icon = "error";
        iconColor = "text-red-500";
      } else if (type === 'warning') {
        icon = "warning";
        iconColor = "text-amber-500";
      }

      return (
        <div
          className={`${
            t.visible ? 'animate-fade-in' : 'animate-fade-out'
          } max-w-sm w-[90vw] sm:w-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-gray-100 rounded-2xl pointer-events-auto flex items-center p-4 gap-3 transition-all duration-300`}
          style={{
            transform: t.visible ? 'translateY(0)' : 'translateY(-20px)',
            opacity: t.visible ? 1 : 0,
          }}
        >
          <span className={`material-symbols-outlined ${iconColor} text-[22px] shrink-0`}>
            {icon}
          </span>
          <p className="text-[13px] font-sans font-medium text-gray-800 flex-1 leading-snug">
            {message}
          </p>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 active:scale-90 transition-all shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      );
    }, {
      position: (position as any) || 'top-center',
      duration: 4500,
    });
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
        <Toaster position="top-center" />
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


