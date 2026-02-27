import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import eventService from '../services/eventService'
import organizerService from '../services/organizerService'
import registrationService from '../services/registrationService'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import ConfirmModal from '../components/ConfirmModal'
import {
  Calendar, Clock, MapPin, Users, Edit, Trash2, ArrowLeft,
  ExternalLink, CheckCircle, XCircle, Loader2, DollarSign, Eye, EyeOff,
} from 'lucide-react'
import { format } from 'date-fns'

const EventDetails = () => {
  const { id } = useParams()
  const { user, isAuthenticated, isAdmin, isOrganizer } = useAuth()
  const navigate = useNavigate()

  // ── Event state ────────────────────────────────────────────────────────
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ── Delete state ──────────────────────────────────────────────────────
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // ── Registration state ─────────────────────────────────────────────────
  const [registrationId, setRegistrationId] = useState(null)
  const [registrationStatus, setRegistrationStatus] = useState(null)
  const [regLoading, setRegLoading] = useState(false)
  const [regError, setRegError] = useState('')

  // ── Load event ─────────────────────────────────────────────────────────
  const loadEvent = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await eventService.getEvent(id)
      setEvent(data)
    } catch {
      setError('Failed to load event details')
    } finally {
      setLoading(false)
    }
  }, [id])

  // ── Load user's existing registration for this event ───────────────────
  const loadRegistrationStatus = useCallback(async () => {
    if (!isAuthenticated()) return
    try {
      const all = await registrationService.getMyRegistrations()
      const existing = all.find(
        (r) => String(r.eventId) === String(id) && r.status !== 'CANCELED'
      )
      if (existing) {
        setRegistrationId(existing.id)
        setRegistrationStatus(existing.status)
      }
    } catch {
      // Non-critical — silently ignore
    }
  }, [id, isAuthenticated])

  useEffect(() => {
    loadEvent()
    loadRegistrationStatus()
  }, [loadEvent, loadRegistrationStatus])

  // ── Register ───────────────────────────────────────────────────────────
  const handleRegister = async () => {
    setRegLoading(true)
    setRegError('')
    try {
      const dto = await registrationService.registerForEvent(id)
      setRegistrationId(dto.id)
      setRegistrationStatus(dto.status)
    } catch (err) {
      setRegError(
        err?.response?.data?.message || err?.message || 'Registration failed'
      )
    } finally {
      setRegLoading(false)
    }
  }

  // ── Cancel registration ────────────────────────────────────────────────
  const handleCancelRegistration = async () => {
    if (!window.confirm('Are you sure you want to cancel your registration?')) return
    setRegLoading(true)
    setRegError('')
    try {
      await registrationService.cancelRegistration(registrationId)
      setRegistrationId(null)
      setRegistrationStatus(null)
    } catch (err) {
      setRegError(
        err?.response?.data?.message || err?.message || 'Failed to cancel registration'
      )
    } finally {
      setRegLoading(false)
    }
  }

  // ── Delete event ───────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true)
    try {
      await organizerService.deleteEvent(id)
      navigate('/my-events')
    } catch (err) {
      setError('Failed to delete event: ' + (err.response?.data?.message || err.message))
      setShowDeleteModal(false)
    } finally {
      setDeleting(false)
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA'
    try {
      return format(new Date(dateString), 'EEEE, MMMM dd, yyyy')
    } catch {
      return dateString
    }
  }

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Free'
    return `${(price / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₸`
  }

  const openInMaps = () => {
    if (event.latitude && event.longitude) {
      window.open(
        `https://www.google.com/maps?q=${event.latitude},${event.longitude}`,
        '_blank'
      )
    }
  }

  // ── Guard renders ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Event not found</h3>
        <p className="text-gray-600 mb-4">
          {error || 'The event you are looking for does not exist'}
        </p>
        <Link to="/" className="btn-primary">Back to Events</Link>
      </div>
    )
  }

  const isEventOrganizer = isAuthenticated() && user && event.organizerId === user.id
  const isStaff = isAdmin() || isOrganizer()
  const showRegistration = isAuthenticated() && !isEventOrganizer && !isStaff

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Delete confirmation modal */}
      <ConfirmModal
        open={showDeleteModal}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone. All registrations will be permanently removed."
        confirmText="Delete Event"
        cancelText="Cancel"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Main content ── */}
        <div className="lg:col-span-2">
          {/* Cover Image */}
          <div className="mb-6 h-96 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg overflow-hidden">
            {event.coverUrl ? (
              <img
                src={event.coverUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Calendar className="h-32 w-32 text-white opacity-50" />
              </div>
            )}
          </div>

          {/* Category */}
          {event.category && (
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full mb-4">
              {event.category}
            </span>
          )}

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>

          {/* Description */}
          {event.description && (
            <div className="card mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">About this event</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          {/* Organizer Actions */}
          {isEventOrganizer && (
            <div className="card bg-primary-50 border-2 border-primary-200">
              <h3 className="font-bold text-gray-900 mb-3">Event Management</h3>
              <p className="text-sm text-gray-600 mb-4">You are the organizer of this event</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/events/edit/${event.id}`}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Event</span>
                </Link>
                <Link
                  to={`/events/${event.id}/registrations`}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Users className="h-4 w-4" />
                  <span>View Registrations</span>
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="btn-danger flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Event</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Event Details</h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Date</p>
                  <p className="text-gray-600">{formatDate(event.date)}</p>
                </div>
              </div>

              {event.time && (
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Time</p>
                    <p className="text-gray-600">{event.time}</p>
                  </div>
                </div>
              )}

              {event.location && (
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">{event.location}</p>
                    {event.latitude && event.longitude && (
                      <button
                        onClick={openInMaps}
                        className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1 mt-1"
                      >
                        <span>View on map</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {event.capacity && (
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Capacity</p>
                    <p className="text-gray-600">{event.capacity} attendees</p>
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="flex items-start space-x-3">
                <DollarSign className="h-5 w-5 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Price</p>
                  <p className={`font-semibold ${event.price ? 'text-gray-900' : 'text-green-600'}`}>
                    {formatPrice(event.price)}
                  </p>
                </div>
              </div>

              {/* Published status */}
              <div className="flex items-start space-x-3">
                {event.published ? (
                  <Eye className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                ) : (
                  <EyeOff className="h-5 w-5 text-amber-600 flex-shrink-0 mt-1" />
                )}
                <div>
                  <p className="font-medium text-gray-900">Status</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${event.published
                    ? 'bg-green-100 text-green-800'
                    : 'bg-amber-100 text-amber-800'
                    }`}>
                    {event.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Registration panel ── */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              {regError && (
                <ErrorMessage error={regError} onClose={() => setRegError('')} />
              )}

              {showRegistration && (
                <>
                  {registrationStatus === null && (
                    <button
                      onClick={handleRegister}
                      disabled={regLoading}
                      className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {regLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Registering…</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span>Register for Event</span>
                        </>
                      )}
                    </button>
                  )}

                  {registrationStatus === 'REGISTERED' && (
                    <>
                      <div className="flex items-center space-x-2 text-green-700 text-sm font-medium">
                        <CheckCircle className="h-4 w-4" />
                        <span>You are registered for this event</span>
                      </div>
                      <button
                        onClick={handleCancelRegistration}
                        disabled={regLoading}
                        className="w-full btn-secondary text-red-600 hover:bg-red-50 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {regLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Cancelling…</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" />
                            <span>Cancel Registration</span>
                          </>
                        )}
                      </button>
                    </>
                  )}

                  {registrationStatus === 'PAID' && (
                    <div className="flex items-center space-x-2 text-blue-700 text-sm font-medium">
                      <CheckCircle className="h-4 w-4" />
                      <span>Registration confirmed &amp; paid</span>
                    </div>
                  )}
                </>
              )}

              {!isAuthenticated() && (
                <Link to="/login" className="w-full btn-primary block text-center">
                  Log in to Register
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetails
