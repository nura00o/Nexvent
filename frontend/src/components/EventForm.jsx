import React from 'react'
import { AlertCircle, Calendar, MapPin, Clock, Users, DollarSign, Image, Cpu, Globe, Eye, EyeOff } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * Shared event form used by both CreateEvent and EditEvent pages.
 * All fields match the backend EventRequest DTO exactly.
 */
const EventForm = ({ formData, onChange, onSubmit, loading, error, submitLabel, onCancel }) => {
    const { t } = useLanguage()

    const handlePublishedToggle = () => {
        onChange({ target: { name: 'published', value: !formData.published } })
    }

    const FormSection = ({ icon: Icon, title, children }) => (
        <div className="card animate-fade-in-up">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
                <div className="p-1.5 bg-primary-100 rounded-lg">
                    <Icon className="h-4 w-4 text-primary-700" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
            </div>
            <div className="space-y-4">{children}</div>
        </div>
    )

    const Field = ({ id, label, required, hint, children }) => (
        <div>
            <label htmlFor={id} className="form-label">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            {children}
            {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
        </div>
    )

    return (
        <>
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fade-in-down">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">
                {/* Basic Info */}
                <FormSection icon={Cpu} title={t('eventForm.sectionBasic')}>
                    <Field id="title" label={t('eventForm.titleLabel')} required>
                        <input id="title" name="title" type="text" required
                            value={formData.title} onChange={onChange}
                            className="input-field" placeholder={t('eventForm.titlePlaceholder')} />
                    </Field>

                    <Field id="description" label={t('eventForm.descriptionLabel')} required>
                        <textarea id="description" name="description" required
                            value={formData.description} onChange={onChange}
                            rows={5} className="input-field resize-none"
                            placeholder={t('eventForm.descriptionPlaceholder')} />
                    </Field>

                    <Field id="categoryId" label={t('eventForm.categoryLabel')} hint={t('eventForm.categoryHint')}>
                        <div className="relative">
                            <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input id="categoryId" name="categoryId" type="number"
                                value={formData.categoryId} onChange={onChange}
                                className="input-field pl-10" placeholder="1" />
                        </div>
                    </Field>
                </FormSection>

                {/* Date & Location */}
                <FormSection icon={Calendar} title={t('eventForm.sectionDateTime')}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field id="date" label={t('eventForm.dateLabel')} required>
                            <div className="relative">
                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input id="date" name="date" type="date" required
                                    value={formData.date} onChange={onChange}
                                    className="input-field pl-10" />
                            </div>
                        </Field>
                        <Field id="time" label={t('eventForm.timeLabel')} required>
                            <div className="relative">
                                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input id="time" name="time" type="time" required
                                    value={formData.time} onChange={onChange}
                                    className="input-field pl-10" />
                            </div>
                        </Field>
                    </div>

                    <Field id="location" label={t('eventForm.locationLabel')} required>
                        <div className="relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input id="location" name="location" type="text" required
                                value={formData.location} onChange={onChange}
                                className="input-field pl-10" placeholder={t('eventForm.locationPlaceholder')} />
                        </div>
                    </Field>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field id="latitude" label={t('eventForm.latitudeLabel')}>
                            <input id="latitude" name="latitude" type="number" step="any"
                                value={formData.latitude} onChange={onChange}
                                className="input-field" placeholder="e.g., 43.2567" />
                        </Field>
                        <Field id="longitude" label={t('eventForm.longitudeLabel')}>
                            <input id="longitude" name="longitude" type="number" step="any"
                                value={formData.longitude} onChange={onChange}
                                className="input-field" placeholder="e.g., 76.9286" />
                        </Field>
                    </div>
                </FormSection>

                {/* Capacity & Price */}
                <FormSection icon={DollarSign} title={t('eventForm.sectionCapacityPrice')}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field id="capacity" label={t('eventForm.capacityLabel')}>
                            <div className="relative">
                                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input id="capacity" name="capacity" type="number" min="1"
                                    value={formData.capacity} onChange={onChange}
                                    className="input-field pl-10" placeholder={t('eventForm.capacityPlaceholder')} />
                            </div>
                        </Field>
                        <Field id="price" label={t('eventForm.priceLabel')} hint={t('eventForm.priceHint')}>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₸</span>
                                <input id="price" name="price" type="number" min="0" step="1"
                                    value={formData.price} onChange={onChange}
                                    className="input-field pl-8" placeholder="0" />
                            </div>
                        </Field>
                    </div>
                </FormSection>

                {/* Cover Image */}
                <FormSection icon={Image} title={t('eventForm.sectionMedia')}>
                    <Field id="coverUrl" label={t('eventForm.coverUrlLabel')}>
                        <div className="relative">
                            <Image className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input id="coverUrl" name="coverUrl" type="url"
                                value={formData.coverUrl} onChange={onChange}
                                className="input-field pl-10" placeholder="https://example.com/image.jpg" />
                        </div>
                    </Field>

                    {/* Cover preview */}
                    {formData.coverUrl && (
                        <div className="mt-2 h-40 rounded-xl overflow-hidden border border-gray-200 animate-scale-in">
                            <img src={formData.coverUrl} alt="Cover preview"
                                className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                        </div>
                    )}
                </FormSection>

                {/* Publish toggle */}
                <div className="card flex items-center justify-between animate-fade-in-up">
                    <div>
                        <p className="font-semibold text-gray-800 text-sm">{t('eventForm.publishLabel')}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {formData.published ? t('eventForm.publishedDesc') : t('eventForm.draftDesc')}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handlePublishedToggle}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 ${formData.published ? 'bg-primary-600' : 'bg-gray-300'}`}
                        role="switch"
                        aria-checked={formData.published}
                    >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${formData.published ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={loading}
                        className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                        {loading ? (
                            <>
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                {t('common.saving')}
                            </>
                        ) : submitLabel}
                    </button>
                    <button type="button" onClick={onCancel} className="btn-secondary">
                        {t('common.cancel')}
                    </button>
                </div>
            </form>
        </>
    )
}

export default EventForm
