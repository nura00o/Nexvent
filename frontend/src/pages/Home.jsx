import React, { useState, useEffect } from 'react'
import eventService from '../services/eventService'
import EventCard from '../components/EventCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useLanguage } from '../contexts/LanguageContext'
import { Calendar, ChevronLeft, ChevronRight, Search, Sparkles } from 'lucide-react'

const PAGE_SIZE = 12

const Home = () => {
  const { t } = useLanguage()
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
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 rounded-2xl p-8 md:p-12 mb-10 text-white animate-fade-in">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-400/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              Nexvent
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight animate-fade-in-up delay-75">
            {t('home.heroTitle')}
          </h1>
          <p className="text-lg text-primary-100 max-w-lg animate-fade-in-up delay-150">
            {t('home.heroSubtitle')}
          </p>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="py-16">
          <LoadingSpinner size="large" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-2xl mb-5">
            <Calendar className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('home.noEventsFound')}</h3>
          <p className="text-gray-500">{t('home.checkBackLater')}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 animate-fade-in">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
                className="flex items-center gap-1.5 btn-secondary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                <ChevronLeft className="h-4 w-4" />
                {t('common.previous')}
              </button>

              <span className="text-sm text-gray-600 font-medium px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm">
                {t('common.pageOf').replace('{{page}}', page + 1).replace('{{total}}', totalPages)}
              </span>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages - 1}
                className="flex items-center gap-1.5 btn-secondary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {t('common.next')}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Home
