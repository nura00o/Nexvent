import React, { useState, useEffect, useCallback } from 'react'
import registrationService from '../services/registrationService'
import { useLanguage } from '../contexts/LanguageContext'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import ConfirmModal from '../components/ConfirmModal'
import { Calendar, CheckCircle, XCircle, DollarSign, AlertCircle, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

const STATUS_STYLES = {
  REGISTERED: 'bg-blue-100 text-blue-800 border border-blue-200',
  PAID: 'bg-green-100 text-green-800 border border-green-200',
  CANCELLED: 'bg-red-100 text-red-800 border border-red-200',
}

const MyRegistrations = () => {
  const { t } = useLanguage()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelTarget, setCancelTarget] = useState(null)
  const [cancelling, setCancelling] = useState(false)
  const [markingPaidId, setMarkingPaidId] = useState(null)

  const loadRegistrations = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await registrationService.getMyRegistrations()
      setRegistrations(data)
    } catch (err) {
      setError(err?.message || t('myRegistrations.failedToLoad'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    loadRegistrations()
  }, [loadRegistrations])

  const handleCancel = async () => {
    if (!cancelTarget) return
    setCancelling(true)
    try {
      await registrationService.cancelRegistration(cancelTarget.id)
      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === cancelTarget.id ? { ...r, status: 'CANCELLED' } : r
        )
      )
    } catch (err) {
      setError(err?.message || t('myRegistrations.failedToCancel'))
    } finally {
      setCancelling(false)
      setCancelTarget(null)
    }
  }

  const handleMarkPaid = async (regId) => {
    if (markingPaidId) return
    setMarkingPaidId(regId)
    setError('')
    try {
      await registrationService.markPaid(regId)
      setRegistrations((prev) =>
        prev.map((r) => (r.id === regId ? { ...r, status: 'PAID' } : r))
      )
    } catch (err) {
      setError(err?.message || t('myRegistrations.failedToMarkPaid'))
    } finally {
      setMarkingPaidId(null)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return t('common.dateTba')
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm')
    } catch {
      return dateString
    }
  }

  const formatPrice = (price) => {
    if (!price || price === 0) return t('myRegistrations.free')
    return `${(price / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })} ₸`
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'REGISTERED': return t('myRegistrations.statusRegistered')
      case 'CANCELLED': return t('myRegistrations.statusCancelled')
      case 'PAID': return t('myRegistrations.statusPaid')
      default: return status
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('myRegistrations.myRegistrations')}</h1>

      {/* Cancel Confirm Modal */}
      <ConfirmModal
        open={!!cancelTarget}
        title={t('events.cancelRegistration')}
        message={t('myRegistrations.cancellationConfirm')}
        confirmText={t('events.cancelRegistration')}
        cancelText={t('common.cancel')}
        danger
        loading={cancelling}
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
      />

      <ErrorMessage error={error} onClose={() => setError('')} />

      {loading ? (
        <div className="py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : registrations.length === 0 ? (
        <div className="text-center py-12 card">
          <Calendar className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('myRegistrations.noRegistrations')}</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((r) => (
            <div key={r.id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{r.eventTitle}</h3>

                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {/* Status Badge */}
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[r.status] || 'bg-gray-100 text-gray-700'}`}>
                      {getStatusLabel(r.status)}
                    </span>

                    {/* Price */}
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <DollarSign className="h-3.5 w-3.5 text-primary-500" />
                      {formatPrice(r.unitPrice)}
                    </span>
                  </div>

                  {/* Registration date */}
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                    {r.registeredAt && (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {t('myRegistrations.registeredAt')}: {formatDate(r.registeredAt)}
                      </span>
                    )}
                    {r.cancelledAt && (
                      <span className="flex items-center gap-1 text-red-500">
                        <XCircle className="h-3 w-3" />
                        {t('myRegistrations.cancelledAt')}: {formatDate(r.cancelledAt)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  {r.status === 'REGISTERED' && (
                    <>
                      <button
                        onClick={() => handleMarkPaid(r.id)}
                        disabled={markingPaidId === r.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {markingPaidId === r.id ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            {t('common.processing')}
                          </>
                        ) : (
                          <>
                            <DollarSign className="h-3 w-3" />
                            {t('myRegistrations.markPaid')}
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setCancelTarget(r)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                      >
                        <XCircle className="h-3 w-3" />
                        {t('events.cancelRegistration')}
                      </button>
                    </>
                  )}
                  {r.status === 'PAID' && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      {t('myRegistrations.statusPaid')}
                    </span>
                  )}
                  {r.status === 'CANCELLED' && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      {t('myRegistrations.statusCancelled')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyRegistrations
