import React from 'react'
import { AlertTriangle, X, CheckCircle, Info } from 'lucide-react'

/**
 * Reusable confirmation modal with smooth animations.
 */
const ConfirmModal = ({
    open,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    danger = false,
    loading = false,
    onConfirm,
    onCancel,
}) => {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                onClick={!loading ? onCancel : undefined}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-2xl shadow-modal max-w-md w-full p-6 animate-scale-in">
                {/* Close button */}
                <button
                    onClick={onCancel}
                    disabled={loading}
                    className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600
                               hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                    <X className="h-4 w-4" />
                </button>

                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${danger ? 'bg-red-100' : 'bg-primary-100'
                    }`}>
                    {danger
                        ? <AlertTriangle className="h-6 w-6 text-red-600" />
                        : <Info className="h-6 w-6 text-primary-600" />
                    }
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">{message}</p>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="btn-secondary disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`${danger ? 'btn-danger' : 'btn-primary'} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Loading…
                            </span>
                        ) : confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal
