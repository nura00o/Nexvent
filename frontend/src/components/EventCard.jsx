import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import { format } from 'date-fns'

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA'
    try {
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch {
      return dateString
    }
  }

  return (
    <Link to={`/events/${event.id}`} className="block">
      <div className="card hover:shadow-xl transition-shadow duration-300 h-full">
        
        <div className="mb-4 h-48 bg-gradient-to-r from-primary-400 to-primary-600 rounded-lg overflow-hidden">
          {event.coverUrl ? (
            <img 
              src={event.coverUrl} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="h-16 w-16 text-white opacity-50" />
            </div>
          )}
        </div>

        
        {event.category && (
          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full mb-2">
            {event.category}
          </span>
        )}

        
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>

        
        {event.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>
        )}

        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-primary-600" />
            <span>{formatDate(event.date)}</span>
          </div>
          
          {event.time && (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-primary-600" />
              <span>{event.time}</span>
            </div>
          )}
          
          {event.location && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-primary-600" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}
          
          {event.capacity && (
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-primary-600" />
              <span>{event.capacity} spots available</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default EventCard
