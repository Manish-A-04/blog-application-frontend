import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function LikeButton({ blogId, initialLikes = 0, initialIsLiked = false, onLike }) {
  const { user } = useAuth()
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isLoading, setIsLoading] = useState(false)

  const handleLike = async (e) => {
    e.preventDefault()

    if (!user) {
      // Redirect to login
      window.location.href = '/login'
      return
    }

    setIsLoading(true)
    try {
      // Optimistic update
      setIsLiked(!isLiked)
      setLikes(prev => isLiked ? prev - 1 : prev + 1)

      if (onLike) {
        await onLike(!isLiked)
      }
    } catch (error) {
      // Revert on error
      setIsLiked(!isLiked)
      setLikes(initialLikes)
      console.error('Failed to like blog:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isLiked
          ? 'bg-primary text-white'
          : 'bg-background-secondary text-foreground hover:bg-primary/20'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <span className={`text-xl transition-transform ${isLiked ? 'scale-125' : ''}`}>
        {isLiked ? '❤️' : '🤍'}
      </span>
      <span>{likes}</span>
    </button>
  )
}
