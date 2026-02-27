import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import organizerService from '../services/organizerService'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import {
    ArrowLeft, Users, CheckCircle, DollarSign, Loader2,
} from 'lucide-react'

const STATUS_STYLES = {
    REGISTERED: 'bg-blue-100 text-blue-800',
    PAID: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
}

const EventRegistrations = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [registrations, setRegistrations] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [markingPaidId, setMarkingPaidId] = useState(null)

    const loadRegistrations = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const data = await organizerService.getEventRegistrations(id)
            setRegistrations(data)
        } catch (err) {
            if (err?.response?.status === 403) {
                setError('Access denied. You are not the organizer of this event.')
            } else if (err?.response?.status === 404) {
                setError('Event not found.')
            } else {
                setError(err?.response?.data?.message || 'Failed to load registrations')
            }
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        loadRegistrations()
    }, [loadRegistrations])

    const handleMarkPaid = async (registrationId) => {
        // Prevent double click
        if (markingPaidId) return
        setMarkingPaidId(registrationId)
        setError('')

        try {
            await organizerService.markPaid(registrationId)
            // Update local state immediately
            setRegistrations((prev) =>
                prev.map((reg) =>
                    reg.id === registrationId ? { ...reg, status: 'PAID' } : reg
                )
            )
        } catch (err) {
            if (err?.response?.status === 403) {
                setError('Access denied.')
            } else {
                setError(err?.response?.data?.message || 'Failed to mark as paid')
            }
        } finally {
            setMarkingPaidId(null)
        }
    }

    const formatPrice = (price) => {
        if (!price || price === 0) return 'Free'
        return `${(price / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })} ₸`
    }

    // Counters
    const total = registrations.length
    const paid = registrations.filter((r) => r.status === 'PAID').length
    const active = registrations.filter((r) => r.status === 'REGISTERED').length
    const cancelled = registrations.filter((r) => r.status === 'CANCELLED').length

    return (
        <div className="max-w-5xl mx-auto">
            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
            >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
            </button>

            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
                <Users className="h-8 w-8 text-primary-600" />
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Event Registrations</h1>
                    <p className="text-gray-600">Manage registrations for this event</p>
                </div>
            </div>

            <ErrorMessage error={error} onClose={() => setError('')} />

            {/* Stats cards */}
            {!loading && registrations.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="card bg-gradient-to-br from-blue-50 to-blue-100 text-center py-4">
                        <p className="text-sm text-blue-600 font-medium">Total</p>
                        <p className="text-2xl font-bold text-blue-900">{total}</p>
                    </div>
                    <div className="card bg-gradient-to-br from-indigo-50 to-indigo-100 text-center py-4">
                        <p className="text-sm text-indigo-600 font-medium">Active</p>
                        <p className="text-2xl font-bold text-indigo-900">{active}</p>
                    </div>
                    <div className="card bg-gradient-to-br from-green-50 to-green-100 text-center py-4">
                        <p className="text-sm text-green-600 font-medium">Paid</p>
                        <p className="text-2xl font-bold text-green-900">{paid}</p>
                    </div>
                    <div className="card bg-gradient-to-br from-red-50 to-red-100 text-center py-4">
                        <p className="text-sm text-red-600 font-medium">Cancelled</p>
                        <p className="text-2xl font-bold text-red-900">{cancelled}</p>
                    </div>
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="py-12">
                    <LoadingSpinner size="large" />
                </div>
            ) : registrations.length === 0 ? (
                /* Empty state */
                <div className="text-center py-12 card">
                    <Users className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No registrations yet</h3>
                    <p className="text-gray-600">No one has registered for this event yet</p>
                </div>
            ) : (
                /* Registrations table */
                <div className="card overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">#</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Event</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Price</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map((reg, index) => (
                                    <tr key={reg.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>

                                        <td className="py-3 px-4">
                                            <p className="text-sm font-medium text-gray-900">{reg.eventTitle}</p>
                                            <p className="text-xs text-gray-500">Registration #{reg.id}</p>
                                        </td>

                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[reg.status] || 'bg-gray-100 text-gray-800'}`}>
                                                {reg.status}
                                            </span>
                                        </td>

                                        <td className="py-3 px-4 text-right text-sm font-medium text-gray-900">
                                            {formatPrice(reg.unitPrice)}
                                        </td>

                                        <td className="py-3 px-4 text-right">
                                            {reg.status === 'REGISTERED' ? (
                                                <button
                                                    onClick={() => handleMarkPaid(reg.id)}
                                                    disabled={markingPaidId === reg.id}
                                                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    {markingPaidId === reg.id ? (
                                                        <>
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                            <span>Processing…</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <DollarSign className="h-3 w-3" />
                                                            <span>Mark Paid</span>
                                                        </>
                                                    )}
                                                </button>
                                            ) : reg.status === 'PAID' ? (
                                                <span className="inline-flex items-center space-x-1 text-xs text-green-700 font-medium">
                                                    <CheckCircle className="h-3 w-3" />
                                                    <span>Paid</span>
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EventRegistrations
