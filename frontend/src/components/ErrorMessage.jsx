import React from 'react';
import { AlertCircle, XCircle } from 'lucide-react';

const ErrorMessage = ({ error, onClose, type = 'error' }) => {
  if (!error) return null;

  const bgColor = type === 'error' ? 'bg-red-50' : type === 'warning' ? 'bg-yellow-50' : 'bg-blue-50';
  const borderColor = type === 'error' ? 'border-red-200' : type === 'warning' ? 'border-yellow-200' : 'border-blue-200';
  const textColor = type === 'error' ? 'text-red-800' : type === 'warning' ? 'text-yellow-800' : 'text-blue-800';
  const iconColor = type === 'error' ? 'text-red-600' : type === 'warning' ? 'text-yellow-600' : 'text-blue-600';

  const extractErrorMessage = (error) => {
  
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.response?.data?.error) return error.response.data.error;
    
    
    if (error?.response?.data?.validationErrors) {
      const validationErrors = error.response.data.validationErrors;
      return validationErrors.map(e => `${e.field}: ${e.message}`).join(', ');
    }
    
    return 'An error occurred';
  };

  const errorMessage = extractErrorMessage(error);

  return (
    <div className={`mb-4 p-4 ${bgColor} border ${borderColor} rounded-lg flex items-start space-x-2`}>
      <AlertCircle className={`h-5 w-5 ${iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p className={`text-sm ${textColor}`}>{errorMessage}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`${iconColor} hover:opacity-75 transition-opacity`}
          aria-label="Close"
        >
          <XCircle className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
