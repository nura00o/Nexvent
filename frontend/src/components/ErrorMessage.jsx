import React from 'react';
import { AlertCircle, XCircle, CheckCircle, Info } from 'lucide-react';

const ErrorMessage = ({ error, onClose, type = 'error' }) => {
  if (!error) return null;

  const config = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-500',
      Icon: AlertCircle,
    },
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      icon: 'text-emerald-500',
      Icon: CheckCircle,
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: 'text-amber-500',
      Icon: AlertCircle,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-500',
      Icon: Info,
    },
  };

  const c = config[type] || config.error;
  const { Icon } = c;

  const extractMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.response?.data?.error) return error.response.data.error;
    if (error?.response?.data?.validationErrors) {
      return error.response.data.validationErrors.map((e) => `${e.field}: ${e.message}`).join(', ');
    }
    return 'An error occurred';
  };

  return (
    <div className={`mb-4 p-4 ${c.bg} border ${c.border} rounded-xl flex items-start gap-3 animate-fade-in-down`}>
      <Icon className={`h-5 w-5 ${c.icon} flex-shrink-0 mt-0.5`} />
      <p className={`text-sm ${c.text} flex-1 leading-relaxed`}>{extractMessage(error)}</p>
      {onClose && (
        <button
          onClick={onClose}
          className={`${c.icon} hover:opacity-75 transition-opacity flex-shrink-0`}
          aria-label="Close"
        >
          <XCircle className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
