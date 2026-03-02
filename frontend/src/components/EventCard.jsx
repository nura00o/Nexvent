import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { format } from 'date-fns'

const EventCard = ({ event, index = 0 }) => {
  const { t } = useLanguage()

  const formatDate = (dateString) => {
    if (!dateString) return t('common.dateTba')
    try {
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch {
      return dateString
    }
  }

  const formatPrice = (price) => {
    if (!price || price === 0) return t('common.free')
    return `${(price / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })} ₸`
  }

  // Stagger delay based on card position
  const delayClass = ['delay-75', 'delay-100', 'delay-150', 'delay-200', 'delay-300', 'delay-400'][index % 6]

  return (
    <Link to={`/events/${event.id}`} className="block group">
      <div className={`card h-full flex flex-col transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-card-hover animate-fade-in-up ${delayClass}`}>

        {/* Cover Image */}
        <div className="mb-4 h-48 rounded-xl overflow-hidden relative flex-shrink-0">
          {event.coverUrl ? (
            <img
              src={event.coverUrl}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 via-primary-500 to-primary-700">
              <Calendar className="h-16 w-16 text-white/50 transition-transform duration-500 group-hover:scale-110" />
            </div>
          )}
          {/* Price badge overlay */}
          {event.price !== undefined && (
            <div className="absolute top-3 right-3">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm ${event.price === 0 ? 'bg-emerald-500 text-white' : 'bg-white text-gray-900'}`}>
                {formatPrice(event.price)}
              </span>
            </div>
          )}
        </div>

        {/* Category */}
        {event.category && (
          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full mb-2 self-start">
            {event.category}
          </span>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-1.5 line-clamp-2 group-hover:text-primary-700 transition-colors duration-200 flex-grow-0">
          {event.title}
        </h3>

        {/* Description */}
        {event.description && (
          <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
            {event.description}
          </p>
        )}

        {/* Meta info */}
        <div className="mt-auto space-y-1.5 text-sm text-gray-500 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-primary-500 flex-shrink-0" />
            <span>{formatDate(event.date)}</span>
            {event.time && (
              <>
                <Clock className="h-3.5 w-3.5 text-primary-500 flex-shrink-0 ml-1" />
                <span>{event.time}</span>
              </>
            )}
          </div>

          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary-500 flex-shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}

          {event.capacity && (
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-primary-500 flex-shrink-0" />
              <span>{t('home.spotsAvailable').replace('{{count}}', event.capacity)}</span>
            </div>
          )}
        </div>

        {/* Card footer CTA */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {event.published ? '' : ''}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-primary-600 group-hover:gap-2 transition-all duration-200">
            {t('common.viewDetails')} <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default EventCard
