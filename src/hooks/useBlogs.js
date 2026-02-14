import { useState, useCallback } from 'react'
import axios from '../api/axiosInstance'

export function useBlogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 })

  const fetchBlogs = useCallback(async (page = 1, limit = 10, search = '', tag = '') => {
    try {
      setLoading(true)
      setError(null)

      const params = { page, limit }
      if (search) params.search = search
      if (tag) params.tag = tag

      const response = await axios.get('/blogs', { params })

      setBlogs(response.data.blogs || [])
      setPagination({
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total,
      })

      return response.data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch blogs'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchBlogById = useCallback(async (id) => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.get(`/blogs/${id}`)
      return response.data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch blog'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createBlog = useCallback(async (blogData) => {
    try {
      setError(null)
      const response = await axios.post('/blogs', blogData)
      return response.data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create blog'
      setError(message)
      throw new Error(message)
    }
  }, [])

  const updateBlog = useCallback(async (id, blogData) => {
    try {
      setError(null)
      const response = await axios.put(`/blogs/${id}`, blogData)
      return response.data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update blog'
      setError(message)
      throw new Error(message)
    }
  }, [])

  const deleteBlog = useCallback(async (id) => {
    try {
      setError(null)
      await axios.delete(`/blogs/${id}`)
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete blog'
      setError(message)
      throw new Error(message)
    }
  }, [])

  const likeBlog = useCallback(async (id) => {
    try {
      setError(null)
      const response = await axios.post(`/blogs/${id}/like`)
      return response.data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to like blog'
      setError(message)
      throw new Error(message)
    }
  }, [])

  const unlikeBlog = useCallback(async (id) => {
    try {
      setError(null)
      const response = await axios.delete(`/blogs/${id}/like`)
      return response.data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to unlike blog'
      setError(message)
      throw new Error(message)
    }
  }, [])

  const createComment = useCallback(async (blogId, content) => {
    try {
      setError(null)
      const response = await axios.post(`/blogs/${blogId}/comments`, { content })
      return response.data
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create comment'
      setError(message)
      throw new Error(message)
    }
  }, [])

  const deleteComment = useCallback(async (commentId) => {
    try {
      setError(null)
      await axios.delete(`/comments/${commentId}`)
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete comment'
      setError(message)
      throw new Error(message)
    }
  }, [])

  return {
    blogs,
    loading,
    error,
    pagination,
    fetchBlogs,
    fetchBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    unlikeBlog,
    createComment,
    deleteComment,
  }
}
