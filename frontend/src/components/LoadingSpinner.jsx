import React from 'react'
import { Zap } from 'lucide-react'

const LoadingSpinner = ({ size = 'medium', message }) => {
  const config = {
    small: { ring: 'h-6 w-6', icon: 'h-3 w-3', text: 'text-xs' },
    medium: { ring: 'h-12 w-12', icon: 'h-5 w-5', text: 'text-sm' },
    large: { ring: 'h-20 w-20', icon: 'h-8 w-8', text: 'text-base' },
  }
  const c = config[size] || config.medium

  return (
    <div className="flex flex-col items-center justify-center gap-4 animate-fade-in">
      {/* Spinner ring with logo center */}
      <div className="relative">
        {/* Outer spinning ring */}
        <div className={`${c.ring} rounded-full border-4 border-gray-100 border-t-primary-600 animate-spin`} />
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Zap className={`${c.icon} text-primary-600 animate-pulse-soft`} />
        </div>
      </div>

      {message && (
        <p className={`${c.text} text-gray-500 font-medium animate-pulse-soft`}>{message}</p>
      )}
    </div>
  )
}

export default LoadingSpinner
