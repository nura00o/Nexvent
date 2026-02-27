import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import statsService from '../services/statsService'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import {
    BarChart3, Users, DollarSign, XCircle, CheckCircle,
    Calendar, TrendingUp,
} from 'lucide-react'

const OrganizerStats = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Date filter
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')

    const loadStats = useCallback(async () => {
        setLoading(true)
        setError('')
        try {
            const params = {}
            if (from) params.from = new Date(from).toISOString()
            if (to) params.to = new Date(to).toISOString()
            const data = await statsService.getOverview(params)
            setStats(data)
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || 'Failed to load statistics')
        } finally {
            setLoading(false)
        }
    }, [from, to])

    useEffect(() => {
        loadStats()
    }, [loadStats])

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '—'
        return `${(amount / 100).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })} ₸`
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
                <BarChart3 className="h-8 w-8 text-primary-600" />
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Organizer Statistics</h1>
                    <p className="text-gray-600">Overview of your events performance</p>
                </div>
            </div>

            {/* Date Filter */}
            <div className="card mb-6">
                <div className="flex flex-wrap items-end gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                        <input
                            type="date"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                        <input
                            type="date"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <button
                        onClick={() => { setFrom(''); setTo('') }}
                        className="btn-secondary"
                    >
                        Clear
                    </button>
                </div>
            </div>

            <ErrorMessage error={error} onClose={() => setError('')} />

            {/* Loading */}
            {loading ? (
                <div className="py-12">
                    <LoadingSpinner size="large" />
                </div>
            ) : !stats ? (
                <div className="text-center py-12">
                    <BarChart3 className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No data available</h3>
                    <p className="text-gray-600">Create events and get registrations to see statistics here</p>
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-600 font-medium">Registrations</p>
                                    <p className="text-3xl font-bold text-blue-900">{stats.registrations}</p>
                                </div>
                                <Users className="h-12 w-12 text-blue-600 opacity-50" />
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-green-50 to-green-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-600 font-medium">Paid</p>
                                    <p className="text-3xl font-bold text-green-900">{stats.paid}</p>
                                </div>
                                <CheckCircle className="h-12 w-12 text-green-600 opacity-50" />
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-red-50 to-red-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-red-600 font-medium">Canceled</p>
                                    <p className="text-3xl font-bold text-red-900">{stats.canceled}</p>
                                </div>
                                <XCircle className="h-12 w-12 text-red-600 opacity-50" />
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-purple-600 font-medium">Revenue</p>
                                    <p className="text-2xl font-bold text-purple-900">{formatCurrency(stats.revenue)}</p>
                                </div>
                                <DollarSign className="h-12 w-12 text-purple-600 opacity-50" />
                            </div>
                        </div>
                    </div>

                    {/* By Event Table */}
                    <div className="card">
                        <div className="flex items-center space-x-3 mb-4">
                            <TrendingUp className="h-6 w-6 text-primary-600" />
                            <h2 className="text-xl font-bold text-gray-900">Breakdown by Event</h2>
                        </div>

                        {!stats.byEvent || stats.byEvent.length === 0 ? (
                            <div className="text-center py-8">
                                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-600">No event data for the selected period</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Event</th>
                                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Registrations</th>
                                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Paid</th>
                                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Canceled</th>
                                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.byEvent.map((evt) => (
                                            <tr key={evt.eventId} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <Link
                                                        to={`/events/${evt.eventId}`}
                                                        className="text-sm font-medium text-primary-600 hover:text-primary-700"
                                                    >
                                                        {evt.title}
                                                    </Link>
                                                </td>
                                                <td className="py-3 px-4 text-right text-sm text-gray-900">{evt.registrations}</td>
                                                <td className="py-3 px-4 text-right">
                                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        {evt.paid}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        {evt.canceled}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-right text-sm font-medium text-gray-900">
                                                    {formatCurrency(evt.revenue)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                    {/* Totals row */}
                                    <tfoot>
                                        <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                                            <td className="py-3 px-4 text-sm text-gray-900">Total</td>
                                            <td className="py-3 px-4 text-right text-sm text-gray-900">{stats.registrations}</td>
                                            <td className="py-3 px-4 text-right text-sm text-green-700">{stats.paid}</td>
                                            <td className="py-3 px-4 text-right text-sm text-red-700">{stats.canceled}</td>
                                            <td className="py-3 px-4 text-right text-sm text-gray-900">{formatCurrency(stats.revenue)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default OrganizerStats
