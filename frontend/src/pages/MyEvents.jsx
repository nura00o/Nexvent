import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import organizerService from '../services/organizerService'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import ConfirmModal from '../components/ConfirmModal'
import {
  PlusCircle, Calendar, Edit, Trash2, Users, Eye, EyeOff,
  ChevronLeft, ChevronRight, BarChart3,
} from 'lucide-react'
import { format } from 'date-fns'

const PAGE_SIZE = 12

const MyEvents = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Pagination
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadMyEvents = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await organizerService.getMyEvents({ page, size: PAGE_SIZE })
      setEvents(response.content || [])
      setTotalPages(response.totalPages || 0)
      setTotalElements(response.totalElements || 0)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load your events')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    loadMyEvents()
  }, [loadMyEvents])

  // Delete
  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await organizerService.deleteEvent(deleteTarget.id)
      setDeleteTarget(null)
      // Refetch current page; go back if we deleted the last item on this page
      if (events.length === 1 && page > 0) {
        setPage((p) => p - 1)
      } else {
        loadMyEvents()
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete event')
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA'
    try {
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch {
      return dateString
    }
  }

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Free'
    return `${(price / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })} ₸`
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Delete Modal */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
          <p className="text-gray-600">
            {totalElements > 0
              ? `${totalElements} event${totalElements !== 1 ? 's' : ''} total`
              : 'Manage your organized events'}
          </p>
        </div>
        <Link to="/events/create" className="btn-primary flex items-center space-x-2">
          <PlusCircle className="h-5 w-5" />
          <span>Create Event</span>
        </Link>
      </div>

      <ErrorMessage error={error} onClose={() => setError('')} />

      {/* Content */}
      {loading ? (
        <div className="py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 card">
          <Calendar className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No events yet</h3>
          <p className="text-gray-600 mb-6">Start by creating your first event</p>
          <Link to="/events/create" className="btn-primary inline-flex items-center space-x-2">
            <PlusCircle className="h-5 w-5" />
            <span>Create Your First Event</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Events table */}
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Event</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Price</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      {/* Title */}
                      <td className="py-3 px-4">
                        <Link
                          to={`/events/${event.id}`}
                          className="text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                          {event.title}
                        </Link>
                        {event.location && (
                          <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{event.location}</p>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(event.date)}
                        {event.time && <span className="text-gray-400 ml-1">{event.time}</span>}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                        {formatPrice(event.price)}
                      </td>

                      {/* Published */}
                      <td className="py-3 px-4 text-center">
                        {event.published ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Eye className="h-3 w-3" />
                            <span>Published</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            <EyeOff className="h-3 w-3" />
                            <span>Draft</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4">
                        <div className="flex justify-end space-x-1">
                          <button
                            onClick={() => navigate(`/events/edit/${event.id}`)}
                            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Edit event"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/events/${event.id}/registrations`)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View registrations"
                          >
                            <Users className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/events/${event.id}/analytics`)}
                            className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Analytics"
                          >
                            <BarChart3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(event)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete event"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-600">
                Page {page + 1} of {totalPages}
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="btn-secondary flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="btn-secondary flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MyEvents
