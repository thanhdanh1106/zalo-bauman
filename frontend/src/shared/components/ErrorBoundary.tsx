import { useRouteError } from 'react-router-dom';

const ErrorBoundary = () => {
  const error = useRouteError() as { message?: string; statusText?: string };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-300">
      <div className="flex flex-col items-center text-center max-w-2xl">
        {/* Error Icon */}
        <div className="w-24 h-24 mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-red-500 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        {/* Error Code */}
        <h1 className="text-8xl font-bold text-slate-800 dark:text-slate-200 mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          500
        </h1>

        {/* Error Title */}
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-4">
          Oops… You've found a broken page
        </h2>

        {/* Error Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6 w-full shadow-sm">
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            <strong className="text-slate-800 dark:text-slate-200">
              Application Error:
            </strong>
          </p>
          <p className="text-red-600 dark:text-red-400 font-mono text-sm bg-red-50 dark:bg-red-900/20 rounded p-3 border border-red-200 dark:border-red-800">
            {error?.message || error?.statusText || 'Unknown error occurred'}
          </p>
        </div>

        {/* Description */}
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
          We're sorry, but something went wrong on our server. Our team has been
          notified and is working to fix this issue.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Try Again
          </button>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;


