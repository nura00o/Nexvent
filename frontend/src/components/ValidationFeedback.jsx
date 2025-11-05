import React from 'react';
import { AlertCircle } from 'lucide-react';

const ValidationFeedback = ({ error, touched }) => {
  if (!error || !touched) return null;

  return (
    <div className="mt-1 flex items-center space-x-1 text-red-600">
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span className="text-sm">{error}</span>
    </div>
  );
};

export default ValidationFeedback;
