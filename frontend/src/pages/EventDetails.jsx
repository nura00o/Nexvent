import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import eventService from '../services/eventService'
import LoadingSpinner from '../components/LoadingSpinner'
import { Calendar, Clock, MapPin, Users, Edit, Trash2, ArrowLeft, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'

const EventDetails = () => {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadEvent()
  }, [id])

  const loadEvent = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await eventService.getEvent(id)
      setEvent(data)
    } catch (err) {
      setError('Failed to load event details')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return
    }

    setDeleting(true)
    try {
      await eventService.deleteEvent(id)
      navigate('/my-events')
    } catch (err) {
      alert('Failed to delete event: ' + (err.response?.data?.message || err.message))
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA'
    try {
      return format(new Date(dateString), 'EEEE, MMMM dd, yyyy')
    } catch {
      return dateString
    }
  }

  const openInMaps = () => {
    if (event.latitude && event.longitude) {
      window.open(`https://www.google.com/maps?q=${event.latitude},${event.longitude}`, '_blank')
    }
  }

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
        <p className="text-gray-600 mb-4">{error || 'The event you are looking for does not exist'}</p>
        <Link to="/" className="btn-primary">
          Back to Events
        </Link>
      </div>
    )
  }

  // Check if current user is the organizer
  const isOrganizer = isAuthenticated() && user && event.organizerId === user.id

  return (
    <div>
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
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

          {/* Category Badge */}
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
          {isOrganizer && (
            <div className="card bg-primary-50 border-2 border-primary-200">
              <h3 className="font-bold text-gray-900 mb-3">Event Management</h3>
              <p className="text-sm text-gray-600 mb-4">You are the organizer of this event</p>
              <div className="flex space-x-3">
                <Link to={`/events/edit/${event.id}`} className="btn-primary flex items-center space-x-2">
                  <Edit className="h-4 w-4" />
                  <span>Edit Event</span>
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="btn-danger flex items-center space-x-2 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>{deleting ? 'Deleting...' : 'Delete Event'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
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
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="w-full btn-primary">
                Register for Event
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Registration feature coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetails
