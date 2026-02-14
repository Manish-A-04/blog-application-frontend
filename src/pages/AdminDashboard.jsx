import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from '../api/axiosInstance'
import { Spinner } from '../components/Loader'

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [blogsRes, statsRes] = await Promise.all([
        axios.get('/blogs?limit=1000'), // Get all blogs for admin
        axios.get('/admin/analytics')
      ])

      setBlogs(blogsRes.data.blogs || [])
      setStats(statsRes.data)
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = async () => {
    try {
      const response = await axios.get('/admin/export/csv', {
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'blogs_export.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Failed to export CSV:', error)
      alert('Failed to export CSV')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  // Use real stats if available, otherwise calculate from blogs (fallback)
  // But stats endpoint is better
  const statsData = [
    { label: 'Total Blogs', value: stats?.total_blogs || 0, color: 'from-primary to-accent' },
    { label: 'Published', value: blogs.filter(b => b.status === 'published').length, color: 'from-secondary to-accent' },
    { label: 'Drafts', value: blogs.filter(b => b.status === 'draft').length, color: 'from-muted to-border' },
    { label: 'Total Likes', value: stats?.total_likes || 0, color: 'from-primary to-secondary' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-foreground"
        >
          Admin Dashboard
        </motion.h1>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        {statsData.map((stat, i) => (
          <motion.div key={i} variants={cardVariants} className="glassmorphism rounded-lg p-6">
            <p className="text-muted text-sm mb-2">{stat.label}</p>
            <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Blogs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glassmorphism rounded-lg overflow-hidden"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">All Blogs</h2>

          {blogs.length === 0 ? (
            <p className="text-muted text-center py-8">No blogs found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Title</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Author</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Likes</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Date</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="border-b border-border hover:bg-background-secondary transition-colors">
                      <td className="py-4 px-4 text-sm text-foreground font-medium">{blog.title}</td>
                      <td className="py-4 px-4 text-sm text-muted">{blog.author?.username || 'Unknown'}</td>
                      <td className="py-4 px-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${blog.status === 'published'
                            ? 'bg-secondary/20 text-secondary'
                            : blog.status === 'draft'
                              ? 'bg-muted/20 text-muted'
                              : 'bg-accent/20 text-accent'
                          }`}>
                          {blog.status ? (blog.status.charAt(0).toUpperCase() + blog.status.slice(1)) : 'Unknown'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-foreground">{blog.likes_count || 0}</td>
                      <td className="py-4 px-4 text-sm text-muted">
                        {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-sm text-right">
                        <Link
                          to={`/blog/${blog.id}`}
                          className="px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
