import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import eventService from '../services/eventService'
import { ArrowLeft, AlertCircle, Calendar } from 'lucide-react'

const CreateEvent = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
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
    coverUrl: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Convert empty strings to null for optional fields
      const eventData = {
        title: formData.title,
        description: formData.description,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : 1,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        ...(formData.latitude && { latitude: parseFloat(formData.latitude) }),
        ...(formData.longitude && { longitude: parseFloat(formData.longitude) }),
        ...(formData.capacity && { capacity: parseInt(formData.capacity) }),
        ...(formData.coverUrl && { coverUrl: formData.coverUrl }),
      };

      const createdEvent = await eventService.createEvent(eventData)
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

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter event title"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="input-field resize-none"
              placeholder="Describe your event..."
            />
          </div>

          {/* Category ID */}
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
              Category ID
            </label>
            <input
              id="categoryId"
              name="categoryId"
              type="number"
              value={formData.categoryId}
              onChange={handleChange}
              className="input-field"
              placeholder="1"
            />
            <p className="text-xs text-gray-500 mt-1">Leave blank to use default category</p>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                id="time"
                name="time"
                type="time"
                required
                value={formData.time}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              name="location"
              type="text"
              required
              value={formData.location}
              onChange={handleChange}
              className="input-field"
              placeholder="Event venue or address"
            />
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., 51.5074"
              />
            </div>

            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., -0.1278"
              />
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
              Capacity
            </label>
            <input
              id="capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              className="input-field"
              placeholder="Maximum number of attendees"
            />
          </div>

          {/* Cover URL */}
          <div>
            <label htmlFor="coverUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image URL
            </label>
            <input
              id="coverUrl"
              name="coverUrl"
              type="url"
              value={formData.coverUrl}
              onChange={handleChange}
              className="input-field"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateEvent
