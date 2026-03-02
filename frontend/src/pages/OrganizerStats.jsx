import React, { useState, useEffect } from 'react'
import organizerService from '../services/organizerService'
import { useLanguage } from '../contexts/LanguageContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { BarChart3, Users, DollarSign, XCircle, TrendingUp } from 'lucide-react'

const OrganizerStats = () => {
    const { t } = useLanguage()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')

    const loadStats = async () => {
        setLoading(true)
        setError('')
        try {
            const params = {}
            if (dateFrom) params.dateFrom = dateFrom
            if (dateTo) params.dateTo = dateTo
            const data = await organizerService.getStats(params)
            setStats(data)
        } catch (err) {
            setError(err?.response?.data?.message || t('organizer.failedToLoad'))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadStats()
    }, [])

    const handleFilter = (e) => {
        e.preventDefault()
        loadStats()
    }

    const handleClear = () => {
        setDateFrom('')
        setDateTo('')
        setTimeout(loadStats, 50)
    }

    const formatRevenue = (amount) => {
        if (!amount || amount === 0) return '0 ₸'
        return `${(amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })} ₸`
    }

    const hasData = stats && (stats.totalRegistrations > 0 || stats.breakdownByEvent?.length > 0)

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
                <BarChart3 className="h-8 w-8 text-primary-600" />
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{t('organizer.statsTitle')}</h1>
                    <p className="text-gray-600">{t('organizer.statsSubtitle')}</p>
                </div>
            </div>

            {/* Date filter */}
            <form onSubmit={handleFilter} className="card flex flex-wrap items-end gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('organizer.dateFrom')}</label>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('organizer.dateTo')}</label>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="input-field"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button type="submit" className="btn-primary">{t('common.filter')}</button>
                    {(dateFrom || dateTo) && (
                        <button type="button" onClick={handleClear} className="btn-secondary flex items-center gap-1">
                            <XCircle className="h-4 w-4" /> {t('organizer.clearFilter')}
                        </button>
                    )}
                </div>
            </form>

            {loading ? (
                <div className="py-12">
                    <LoadingSpinner size="large" />
                </div>
            ) : error ? (
                <div className="card text-center py-12 text-red-600">{error}</div>
            ) : !hasData ? (
                <div className="card text-center py-12">
                    <BarChart3 className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t('organizer.noData')}</h3>
                    <p className="text-gray-600">
                        {dateFrom || dateTo
                            ? t('organizer.noEventData')
                            : t('organizer.noDataDesc')}
                    </p>
                </div>
            ) : (
                <>
                    {/* Summary cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <Users className="h-6 w-6 opacity-80" />
                                <TrendingUp className="h-4 w-4 opacity-60" />
                            </div>
                            <p className="text-2xl font-bold">{stats?.totalRegistrations ?? 0}</p>
                            <p className="text-blue-100 text-sm">{t('organizer.registrations')}</p>
                        </div>

                        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <TrendingUp className="h-6 w-6 opacity-80" />
                                <TrendingUp className="h-4 w-4 opacity-60" />
                            </div>
                            <p className="text-2xl font-bold">{stats?.paidCount ?? 0}</p>
                            <p className="text-green-100 text-sm">{t('organizer.paid')}</p>
                        </div>

                        <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <XCircle className="h-6 w-6 opacity-80" />
                                <TrendingUp className="h-4 w-4 opacity-60" />
                            </div>
                            <p className="text-2xl font-bold">{stats?.cancelledCount ?? 0}</p>
                            <p className="text-red-100 text-sm">{t('organizer.canceled')}</p>
                        </div>

                        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <DollarSign className="h-6 w-6 opacity-80" />
                                <TrendingUp className="h-4 w-4 opacity-60" />
                            </div>
                            <p className="text-2xl font-bold">{formatRevenue(stats?.revenue)}</p>
                            <p className="text-purple-100 text-sm">{t('organizer.revenue')}</p>
                        </div>
                    </div>

                    {/* Per-event table */}
                    {stats?.breakdownByEvent?.length > 0 && (
                        <div className="card overflow-hidden p-0">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900">{t('organizer.breakdownByEvent')}</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">{t('organizer.colEvent')}</th>
                                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">{t('organizer.colRegistrations')}</th>
                                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">{t('organizer.colPaid')}</th>
                                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">{t('organizer.colCanceled')}</th>
                                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">{t('organizer.colRevenue')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.breakdownByEvent.map((row) => (
                                            <tr key={row.eventId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="py-3 px-4 text-sm font-medium text-gray-900">{row.eventTitle}</td>
                                                <td className="py-3 px-4 text-sm text-right text-gray-700">{row.totalRegistrations}</td>
                                                <td className="py-3 px-4 text-sm text-right text-green-700">{row.paidCount}</td>
                                                <td className="py-3 px-4 text-sm text-right text-red-700">{row.cancelledCount}</td>
                                                <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                                                    {formatRevenue(row.revenue)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-gray-50 border-t-2 border-gray-200 font-semibold">
                                            <td className="py-3 px-4 text-sm text-gray-700">{t('organizer.total')}</td>
                                            <td className="py-3 px-4 text-sm text-right">{stats.totalRegistrations}</td>
                                            <td className="py-3 px-4 text-sm text-right text-green-700">{stats.paidCount}</td>
                                            <td className="py-3 px-4 text-sm text-right text-red-700">{stats.cancelledCount}</td>
                                            <td className="py-3 px-4 text-sm text-right text-gray-900">{formatRevenue(stats.revenue)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default OrganizerStats
