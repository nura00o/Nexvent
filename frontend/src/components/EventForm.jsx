import React from 'react'
import { AlertCircle } from 'lucide-react'

/**
 * Shared event form used by both CreateEvent and EditEvent pages.
 * All fields match the backend EventRequest DTO exactly.
 *
 * @param {{
 *   formData: object,
 *   onChange: (e: React.ChangeEvent) => void,
 *   onSubmit: (e: React.FormEvent) => void,
 *   loading: boolean,
 *   error: string,
 *   submitLabel: string,
 *   onCancel: () => void,
 * }} props
 */
const EventForm = ({
    formData,
    onChange,
    onSubmit,
    loading,
    error,
    submitLabel = 'Save',
    onCancel,
}) => {
    /** Toggle handler for the published checkbox */
    const handlePublishedToggle = () => {
        onChange({
            target: { name: 'published', value: !formData.published },
        })
    }

    return (
        <>
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
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
                        onChange={onChange}
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
                        onChange={onChange}
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
                        onChange={onChange}
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
                            onChange={onChange}
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
                            onChange={onChange}
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
                        onChange={onChange}
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
                            onChange={onChange}
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
                            onChange={onChange}
                            className="input-field"
                            placeholder="e.g., -0.1278"
                        />
                    </div>
                </div>

                {/* Capacity & Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                            Capacity
                        </label>
                        <input
                            id="capacity"
                            name="capacity"
                            type="number"
                            min="1"
                            value={formData.capacity}
                            onChange={onChange}
                            className="input-field"
                            placeholder="Maximum attendees"
                        />
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                            Price (₸)
                        </label>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            min="0"
                            step="1"
                            value={formData.price}
                            onChange={onChange}
                            className="input-field"
                            placeholder="0 = Free"
                        />
                        <p className="text-xs text-gray-500 mt-1">Price in tenge. Leave 0 for free events</p>
                    </div>
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
                        onChange={onChange}
                        className="input-field"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                {/* Published toggle */}
                <div className="flex items-center space-x-3">
                    <button
                        type="button"
                        onClick={handlePublishedToggle}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.published ? 'bg-primary-600' : 'bg-gray-300'
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.published ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                    <label className="text-sm font-medium text-gray-700">
                        {formData.published ? 'Published — visible to everyone' : 'Draft — only you can see'}
                    </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : submitLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    )
}

export default EventForm
