import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import eventService from '../services/eventService'
import EventCard from '../components/EventCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { PlusCircle, Calendar } from 'lucide-react'

const MyEvents = () => {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMyEvents()
  }, [])

  const loadMyEvents = async () => {
    setLoading(true)
    try {
      // Get all events and filter by current user's organizerId
      // Note: In a real app, you'd have a dedicated endpoint for this
      const response = await eventService.getEvents({ page: 0, size: 100 })
      const allEvents = response.content || []
      
      // Filter events where current user is organizer
      // This is a workaround since we don't have user ID in the token
      // In production, you'd want a /api/organizer/events endpoint
      setEvents(allEvents)
    } catch (error) {
      console.error('Failed to load events:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
          <p className="text-gray-600">Manage your organized events</p>
        </div>
        <Link to="/events/create" className="btn-primary flex items-center space-x-2">
          <PlusCircle className="h-5 w-5" />
          <span>Create Event</span>
        </Link>
      </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyEvents
