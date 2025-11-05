import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import analyticsService from '../services/analyticsService';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  BarChart3, Users, UserX, UserCheck, TrendingUp, TrendingDown, 
  ArrowLeft, Calendar 
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const EventAnalytics = () => {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
    fetchRegistrations();
  }, [id]);

  const fetchAnalytics = async () => {
    try {
      const data = await analyticsService.getEventAnalytics(id);
      setAnalytics(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const data = await analyticsService.getEventRegistrations(id);
      setRegistrations(data);
    } catch (err) {
      console.error('Failed to fetch registrations:', err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!analytics) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>{t('common.back')}</span>
      </button>

      <div className="flex items-center space-x-3 mb-6">
        <BarChart3 className="h-8 w-8 text-primary-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('analytics.eventAnalytics')}</h1>
          <p className="text-gray-600">{analytics.eventTitle}</p>
        </div>
      </div>

      <ErrorMessage error={error} onClose={() => setError('')} />

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">{t('analytics.totalRegistrations')}</p>
              <p className="text-3xl font-bold text-blue-900">{analytics.totalRegistrations}</p>
            </div>
            <Users className="h-12 w-12 text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">{t('analytics.activeRegistrations')}</p>
              <p className="text-3xl font-bold text-green-900">{analytics.activeRegistrations}</p>
            </div>
            <UserCheck className="h-12 w-12 text-green-600 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-red-50 to-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">{t('analytics.cancelledRegistrations')}</p>
              <p className="text-3xl font-bold text-red-900">{analytics.cancelledRegistrations}</p>
            </div>
            <UserX className="h-12 w-12 text-red-600 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">{t('analytics.availableSlots')}</p>
              <p className="text-3xl font-bold text-purple-900">
                {analytics.capacity ? analytics.availableSlots : '∞'}
              </p>
            </div>
            <Calendar className="h-12 w-12 text-purple-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Rates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">{t('analytics.registrationRate')}</h3>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-green-600">{analytics.registrationRate}%</span>
            {analytics.capacity && (
              <span className="text-sm text-gray-600">
                {t('events.capacity')}: {analytics.capacity}
              </span>
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingDown className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">{t('analytics.cancellationRate')}</h3>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-red-600">{analytics.cancellationRate}%</span>
            <span className="text-sm text-gray-600">
              {analytics.cancelledRegistrations} / {analytics.totalRegistrations}
            </span>
          </div>
        </div>
      </div>

      {/* Registrations List */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t('analytics.viewRegistrations')}</h2>
        {registrations.length === 0 ? (
          <p className="text-gray-600 text-center py-8">{t('events.noEventsFound')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    {t('auth.fullName')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    {t('registration.status')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                    {t('registration.registeredAt')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{reg.userFullName}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          reg.status === 'REGISTERED'
                            ? 'bg-green-100 text-green-800'
                            : reg.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(reg.registeredAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventAnalytics;
