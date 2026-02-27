import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import registrationService from '../services/registrationService';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar, DollarSign, XCircle, CheckCircle, AlertCircle } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage';

// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  REGISTERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100  text-red-800',
  PAID: 'bg-blue-100 text-blue-800',
};

const StatusBadge = ({ status }) => (
  <span
    className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-800'
      }`}
  >
    {status}
  </span>
);

// ─── Loading skeleton ─────────────────────────────────────────────────────────
const RegistrationSkeleton = () => (
  <div className="space-y-4" aria-busy="true" aria-label="Loading registrations">
    {[1, 2, 3].map((i) => (
      <div key={i} className="card animate-pulse">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
          <div className="flex flex-col space-y-2 ml-4">
            <div className="h-9 bg-gray-200 rounded w-28" />
            <div className="h-9 bg-gray-200 rounded w-28" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = ({ t }) => (
  <div className="card text-center py-12">
    <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
    <p className="text-gray-600">
      {t('registration.noRegistrations') || 'You have no registrations yet.'}
    </p>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Per-row action loading: { [registrationId]: 'cancel' | 'markPaid' | null }
  const [actionLoading, setActionLoading] = useState({});

  const { t } = useLanguage();
  const { isAdmin, isOrganizer } = useAuth();
  const navigate = useNavigate();

  const canMarkPaid = isAdmin() || isOrganizer();

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await registrationService.getMyRegistrations();
      setRegistrations(data);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load registrations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // ── Cancel ───────────────────────────────────────────────────────────────
  const handleCancel = async (registrationId) => {
    const confirmed = window.confirm(
      t('registration.cancellationConfirm') ||
      'Are you sure you want to cancel this registration?'
    );
    if (!confirmed) return;

    setActionLoading((prev) => ({ ...prev, [registrationId]: 'cancel' }));
    try {
      await registrationService.cancelRegistration(registrationId);
      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === registrationId ? { ...r, status: 'CANCELLED' } : r
        )
      );
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to cancel registration');
    } finally {
      setActionLoading((prev) => ({ ...prev, [registrationId]: null }));
    }
  };

  // ── Mark Paid ────────────────────────────────────────────────────────────
  const handleMarkPaid = async (registrationId) => {
    setActionLoading((prev) => ({ ...prev, [registrationId]: 'markPaid' }));
    try {
      await registrationService.markPaid(registrationId);
      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === registrationId ? { ...r, status: 'PAID' } : r
        )
      );
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to mark as paid');
    } finally {
      setActionLoading((prev) => ({ ...prev, [registrationId]: null }));
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('registration.myRegistrations') || 'My Registrations'}
        </h1>
      </div>

      {error && (
        <ErrorMessage error={error} onClose={() => setError(null)} />
      )}

      {loading ? (
        <RegistrationSkeleton />
      ) : registrations.length === 0 ? (
        <EmptyState t={t} />
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => {
            const rowAction = actionLoading[reg.id];
            const isCancelling = rowAction === 'cancel';
            const isMarkingPaid = rowAction === 'markPaid';
            const isBusy = Boolean(rowAction);

            return (
              <div key={reg.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  {/* Left: info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h3
                        className="text-xl font-semibold text-gray-900 hover:text-primary-600 cursor-pointer truncate"
                        onClick={() => navigate(`/events/${reg.eventId}`)}
                      >
                        {reg.eventTitle}
                      </h3>
                      <StatusBadge status={reg.status} />
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 flex-shrink-0" />
                      <span>
                        {t('registration.price') || 'Price'}:{' '}
                        <span className="font-medium text-gray-900">
                          {reg.unitPrice != null
                            ? `${reg.unitPrice.toLocaleString()} ₸`
                            : t('registration.free') || 'Free'}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex flex-col space-y-2 flex-shrink-0">
                    {reg.status === 'REGISTERED' && (
                      <button
                        onClick={() => handleCancel(reg.id)}
                        disabled={isBusy}
                        className="btn-secondary text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                        aria-label={`Cancel registration for ${reg.eventTitle}`}
                      >
                        <XCircle className="h-4 w-4" />
                        <span>
                          {isCancelling
                            ? t('common.cancelling') || 'Cancelling…'
                            : t('events.cancelRegistration') || 'Cancel'}
                        </span>
                      </button>
                    )}

                    {canMarkPaid && reg.status === 'REGISTERED' && (
                      <button
                        onClick={() => handleMarkPaid(reg.id)}
                        disabled={isBusy}
                        className="btn-secondary text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                        aria-label={`Mark registration ${reg.id} as paid`}
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>
                          {isMarkingPaid
                            ? t('common.saving') || 'Saving…'
                            : t('registration.markPaid') || 'Mark as Paid'}
                        </span>
                      </button>
                    )}

                    <button
                      onClick={() => navigate(`/events/${reg.eventId}`)}
                      className="btn-secondary"
                    >
                      {t('common.viewDetails') || 'View Details'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;
