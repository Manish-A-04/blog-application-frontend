import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

import { useAuth } from '../hooks/useAuth'
import { useBlogs } from '../hooks/useBlogs'
import LikeButton from '../components/LikeButton'
import CommentSection from '../components/CommentSection'
import { Spinner } from '../components/Loader'
import { formatDateFull, formatDateWithTime } from '../utils/formatDate'

export default function BlogDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const { fetchBlogById, likeBlog, unlikeBlog, createComment, deleteComment } = useBlogs()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBlog()
  }, [id])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await fetchBlogById(id)
      setBlog(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (newIsLiked) => {
    try {
      if (newIsLiked) {
        await likeBlog(id)
      } else {
        await unlikeBlog(id)
      }
    } catch (err) {
      console.error('Failed to update like:', err)
    }
  }

  const handleAddComment = async (content) => {
    try {
      const newComment = await createComment(id, content)
      setBlog(prev => ({
        ...prev,
        comments: [newComment, ...prev.comments],
        comments_count: prev.comments_count + 1
      }))
    } catch (err) {
      console.error('Failed to add comment:', err)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId)
      setBlog(prev => ({
        ...prev,
        comments: prev.comments.filter(c => c.id !== commentId),
        comments_count: prev.comments_count - 1
      }))
    } catch (err) {
      console.error('Failed to delete comment:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="w-12 h-12" />
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">Blog Not Found</h1>
        <p className="text-muted mb-8">{error || 'The blog you are looking for does not exist.'}</p>
        <Link to="/" className="text-primary hover:underline font-medium">
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-96 overflow-hidden"
      >
        <img
          src={blog.cover_image}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
      </motion.div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-muted border-b border-border pb-6">
            <div className="flex items-center gap-3">
              <img
                src={blog.author?.avatar || 'https://via.placeholder.com/40'}
                alt={blog.author?.username}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold text-foreground">{blog.author?.username}</p>
                <p className="text-xs">{formatDateFull(blog.created_at)}</p>
              </div>
            </div>

            {blog.updated_at && blog.updated_at !== blog.created_at && (
              <div className="text-xs">
                Last updated {formatDateWithTime(blog.updated_at)}
              </div>
            )}
          </div>
        </motion.div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {blog.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-background-secondary text-accent rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </motion.div>
        )}

        {/* Markdown Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="prose prose-invert max-w-none mb-8"
        >
          <ReactMarkdown className="markdown-content">
            {blog.content}
          </ReactMarkdown>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4 mb-8 pb-8 border-b border-border"
        >
          <LikeButton
            blogId={blog.id}
            initialLikes={blog.likes_count}
            initialIsLiked={blog.is_liked}
            onLike={handleLike}
          />

          {user && (user.id === blog.author?.id || user.role === 'admin') && (
            <div className="flex gap-2">
              <Link
                to={`/edit/${blog.id}`}
                className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Edit
              </Link>
            </div>
          )}
        </motion.div>

        {/* Comments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <CommentSection
            blogId={blog.id}
            comments={blog.comments || []}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
          />
        </motion.div>
      </article>

      {/* Related Blogs Section */}
      <section className="bg-background-secondary mt-16 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8">More Articles</h2>
          <p className="text-muted">
            Check back soon for related articles from the author.
          </p>
        </div>
      </section>
    </motion.div>
  )
}
