import React, { useState, useEffect } from 'react'
import eventService from '../services/eventService'
import EventCard from '../components/EventCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { Calendar } from 'lucide-react'

const PAGE_SIZE = 12

const Home = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    loadEvents()
  }, [page])

  const loadEvents = async () => {
    setLoading(true)
    try {
      const response = await eventService.getEvents({ page, size: PAGE_SIZE })
      setEvents(response.content || [])
      setTotalPages(response.totalPages || 0)
    } catch (error) {
      console.error('Failed to load events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-8 md:p-12 mb-8 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Events</h1>
        <p className="text-lg md:text-xl text-primary-100">
          Find and join events that match your interests
        </p>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">Check back later for upcoming events</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="text-gray-700 px-4">
                Page {page + 1} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages - 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Home
