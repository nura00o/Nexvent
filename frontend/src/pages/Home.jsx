import React, { useState, useEffect } from 'react'
import eventService from '../services/eventService'
import EventCard from '../components/EventCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { Search, Filter, Calendar } from 'lucide-react'

const Home = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    dateFrom: '',
    dateTo: '',
    page: 0,
    size: 12,
  })
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    loadEvents()
  }, [filters])

  const loadEvents = async () => {
    setLoading(true)
    try {
      const response = await eventService.getEvents(filters)
      setEvents(response.content || [])
      setTotalPages(response.totalPages || 0)
    } catch (error) {
      console.error('Failed to load events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
      page: 0, // Reset to first page when filter changes
    })
  }

  const handlePageChange = (newPage) => {
    setFilters({
      ...filters,
      page: newPage,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-8 md:p-12 mb-8 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Events</h1>
        <p className="text-lg md:text-xl text-primary-100 mb-6">
          Find and join events that match your interests
        </p>
        
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                placeholder="e.g., Music, Tech"
                className="input-field"
              />
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="input-field"
              />
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="input-field"
              />
            </div>
            
            <div className="md:col-span-1 flex items-end">
              <button
                onClick={() => setFilters({ category: '', dateFrom: '', dateTo: '', page: 0, size: 12 })}
                className="btn-secondary w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
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
          <p className="text-gray-600">Try adjusting your filters or check back later</p>
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
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 0}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="text-gray-700 px-4">
                Page {filters.page + 1} of {totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page >= totalPages - 1}
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
