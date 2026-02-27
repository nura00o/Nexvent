import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

/**
 * Reusable confirmation modal.
 * @param {{ open: boolean, title: string, message: string, confirmText?: string, cancelText?: string, danger?: boolean, loading?: boolean, onConfirm: () => void, onCancel: () => void }} props
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in fade-in zoom-in-95">
                {/* Close button */}
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Icon */}
                {danger && (
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                )}

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-6">{message}</p>

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="btn-secondary disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`${danger ? 'btn-danger' : 'btn-primary'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {loading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal
