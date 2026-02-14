import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { formatDateRelative } from '../utils/formatDate'

export default function CommentSection({ blogId, comments = [], onAddComment, onDeleteComment }) {
  const { user } = useAuth()
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      if (onAddComment) {
        await onAddComment(newComment)
      }
      setNewComment('')
    } catch (error) {
      console.error('Failed to add comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (commentId) => {
    if (onDeleteComment) {
      try {
        await onDeleteComment(commentId)
      } catch (error) {
        console.error('Failed to delete comment:', error)
      }
    }
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 glassmorphism rounded-lg p-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full bg-background-secondary text-foreground rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows="3"
          />
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p className="text-muted mb-8">
          <a href="/login" className="text-primary hover:underline">Login</a> to leave a comment
        </p>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-muted text-center py-8">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="glassmorphism rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-foreground">
                  {comment.author?.username || 'Anonymous'}
                </span>
                <span className="text-xs text-muted">
                  {formatDateRelative(comment.createdAt)}
                </span>
              </div>
              <p className="text-foreground-secondary mb-3">{comment.content}</p>
              {user && user.id === comment.author?.id && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-xs text-muted hover:text-primary transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
