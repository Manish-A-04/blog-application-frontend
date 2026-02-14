import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useBlogs } from '../hooks/useBlogs'

export default function CreateBlog() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createBlog } = useBlogs()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    tags: [],
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    status: 'published',
    scheduled_at: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleAddTag = () => {
    if (tagInput.trim() && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required')
      return
    }

    if (formData.tags.length < 2) {
      setError('Please add at least 2 tags')
      return
    }

    if (formData.status === 'scheduled' && !formData.scheduled_at) {
      setError('Please select a schedule date and time')
      return
    }

    setLoading(true)
    try {
      // Map frontend camelCase to backend snake_case
      const payload = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        tags: formData.tags,
        cover_image: formData.coverImage,
        status: formData.status,
        scheduled_at: formData.status === 'scheduled' ? new Date(formData.scheduled_at).toISOString() : null
      }

      const newBlog = await createBlog(payload)
      navigate(`/blog/${newBlog.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background py-12"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-foreground mb-8"
        >
          Write a New Article
        </motion.h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="glassmorphism rounded-lg p-8 space-y-6">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-foreground mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Your article title"
              className="w-full px-4 py-2 bg-background-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              required
            />
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of your article"
              className="w-full px-4 py-2 bg-background-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-foreground mb-2">
              Content (Markdown) *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your article in Markdown..."
              className="w-full px-4 py-2 bg-background-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
              rows="12"
              required
            />
            <p className="text-xs text-muted mt-2">Supports Markdown formatting</p>
          </motion.div>

          {/* Cover Image */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <label className="block text-sm font-medium text-foreground mb-2">
              Cover Image URL
            </label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 bg-background-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            {formData.coverImage && (
              <img
                src={formData.coverImage}
                alt="Cover preview"
                className="mt-2 h-40 w-full object-cover rounded-lg"
              />
            )}
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-foreground mb-2">
              Tags ({formData.tags.length}/5) - Min 2 required *
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add a tag..."
                className="flex-1 px-4 py-2 bg-background-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-background-secondary text-accent rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="hover:text-primary transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </motion.div>

          {/* Status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <label className="block text-sm font-medium text-foreground mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-background-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </motion.div>

          {/* Scheduled Date */}
          {formData.status === 'scheduled' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-foreground mb-2">
                Schedule Publication *
              </label>
              <input
                type="datetime-local"
                name="scheduled_at"
                value={formData.scheduled_at || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-background-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                required={formData.status === 'scheduled'}
              />
              <p className="text-xs text-muted mt-2">
                Your article will be automatically published at this time.
              </p>
            </motion.div>
          )}

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 pt-6"
          >
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Publishing...' : 'Publish Article'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-background-secondary hover:bg-border text-foreground rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  )
}
