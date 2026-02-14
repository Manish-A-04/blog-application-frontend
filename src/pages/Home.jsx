import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import BlogCard from '../components/BlogCard'
import { SkeletonGrid } from '../components/Loader'
import { useBlogs } from '../hooks/useBlogs'

export default function Home() {
  const { blogs, loading, error, pagination, fetchBlogs } = useBlogs()
  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchBlogs(currentPage, 10, search, selectedTag)
  }, [currentPage, search, selectedTag, fetchBlogs])

  const handleSearch = () => {
    setCurrentPage(1)
    fetchBlogs(1, 10, search, selectedTag)
  }

  const allTags = ['React', 'JavaScript', 'CSS', 'Web Design', 'Layout', 'Tutorial', 'Best Practices', 'TypeScript']
  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background to-background-secondary py-16 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Share Your Stories
              </span>
            </h1>
            <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
              Discover insightful articles, connect with writers, and dive deep into topics you love.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex gap-2 mb-8"
          >
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="flex-1 px-4 py-3 bg-background-secondary text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
            >
              Search
            </button>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-2 justify-center"
          >
            <button
              onClick={() => {
                setSelectedTag('')
                setCurrentPage(1)
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${selectedTag === ''
                ? 'bg-primary text-white'
                : 'bg-background-secondary text-foreground hover:bg-border'
                }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => {
                  setSelectedTag(tag)
                  setCurrentPage(1)
                }}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${selectedTag === tag
                  ? 'bg-primary text-white'
                  : 'bg-background-secondary text-foreground hover:bg-border'
                  }`}
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {error && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <SkeletonGrid count={6} />
        ) : !blogs || blogs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted mb-4">No blogs found</p>
            <p className="text-foreground-secondary">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            >
              {blogs.map(blog => (
                <motion.div key={blog.id} variants={cardVariants}>
                  <BlogCard blog={blog} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center items-center gap-2 mt-12"
              >
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-background-secondary hover:bg-border disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg transition-colors ${currentPage === page
                      ? 'bg-primary text-white'
                      : 'bg-background-secondary hover:bg-border'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-background-secondary hover:bg-border disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  Next
                </button>
              </motion.div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
