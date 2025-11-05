import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import registrationService from '../services/registrationService';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar, MapPin, Clock, XCircle, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const data = await registrationService.getMyRegistrations();
      setRegistrations(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (eventId) => {
    if (!window.confirm(t('registration.cancellationConfirm') || 'Are you sure you want to cancel this registration?')) {
      return;
    }

    try {
      await registrationService.cancelRegistration(eventId);
      setRegistrations(prev =>
        prev.map(reg =>
          reg.eventId === eventId ? { ...reg, status: 'CANCELLED' } : reg
        )
      );
    } catch (err) {
      setError(err);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{t('registration.myRegistrations')}</h1>
      </div>

      <ErrorMessage error={error} onClose={() => setError('')} />

      {registrations.length === 0 ? (
        <div className="card text-center py-12">
          <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">{t('events.noEventsFound')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => (
            <div key={reg.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3
                      className="text-xl font-semibold text-gray-900 hover:text-primary-600 cursor-pointer"
                      onClick={() => navigate(`/events/${reg.eventId}`)}
                    >
                      {reg.eventTitle}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        reg.status === 'REGISTERED'
                          ? 'bg-green-100 text-green-800'
                          : reg.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {reg.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {t('registration.registeredAt')}: {new Date(reg.registeredAt).toLocaleString()}
                      </span>
                    </div>
                    {reg.cancelledAt && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <XCircle className="h-4 w-4" />
                        <span>
                          {t('registration.cancelledAt')}: {new Date(reg.cancelledAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  {reg.status === 'REGISTERED' && (
                    <button
                      onClick={() => handleCancelRegistration(reg.eventId)}
                      className="btn-secondary text-red-600 hover:bg-red-50"
                    >
                      {t('events.cancelRegistration')}
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/events/${reg.eventId}`)}
                    className="btn-secondary"
                  >
                    {t('common.viewDetails')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;
