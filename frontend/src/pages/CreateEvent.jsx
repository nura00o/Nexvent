import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import organizerService from '../services/organizerService'
import EventForm from '../components/EventForm'
import { ArrowLeft, Calendar } from 'lucide-react'

const INITIAL_FORM = {
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
}

const CreateEvent = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(INITIAL_FORM)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

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

      const createdEvent = await organizerService.createEvent(eventData)
      navigate(`/events/${createdEvent.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event. Please try again.')
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
        </div>

        <EventForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          submitLabel="Create Event"
          onCancel={() => navigate(-1)}
        />
      </div>
    </div>
  )
}

export default CreateEvent
