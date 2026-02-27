import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import eventService from '../services/eventService'
import organizerService from '../services/organizerService'
import EventForm from '../components/EventForm'
import LoadingSpinner from '../components/LoadingSpinner'
import { ArrowLeft, Calendar } from 'lucide-react'

const EditEvent = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    date: '',
    time: '',
    location: '',
    latitude: '',
    longitude: '',
    capacity: '',
    price: '',
    coverUrl: '',
    published: false,
  })

  useEffect(() => {
    loadEvent()
  }, [id])

  const loadEvent = async () => {
    setLoading(true)
    setError('')
    try {
      const event = await eventService.getEvent(id)
      setFormData({
        title: event.title || '',
        description: event.description || '',
        categoryId: event.categoryId || '',
        date: event.date || '',
        time: event.time || '',
        location: event.location || '',
        latitude: event.latitude ?? '',
        longitude: event.longitude ?? '',
        capacity: event.capacity ?? '',
        price: event.price ?? '',
        coverUrl: event.coverUrl || '',
        published: event.published ?? false,
      })
    } catch (err) {
      setError('Failed to load event')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : 1,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        price: formData.price ? parseInt(formData.price) : null,
        coverUrl: formData.coverUrl || null,
        published: formData.published,
      }

      const updatedEvent = await organizerService.updateEvent(id, eventData)
      navigate(`/events/${updatedEvent.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <Calendar className="h-8 w-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
        </div>

        <EventForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={saving}
          error={error}
          submitLabel="Save Changes"
          onCancel={() => navigate(-1)}
        />
      </div>
    </div>
  )
}

export default EditEvent
