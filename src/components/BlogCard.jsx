import React from 'react'
import { Link } from 'react-router-dom'
import { formatDateRelative } from '../utils/formatDate'

export default function BlogCard({ blog }) {
  const statusColors = {
    published: 'bg-secondary',
    draft: 'bg-muted',
    scheduled: 'bg-accent',
  }

  return (
    <Link to={`/blog/${blog.id}`}>
      <div className="group glassmorphism rounded-lg overflow-hidden hover:border-primary transition-all duration-300 hover:scale-105 h-full">
        {/* Cover Image */}
        <div className="relative h-48 overflow-hidden bg-background-secondary">
          {blog.cover_image ? (
            <img
              src={blog.cover_image}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted">
              <span>No Image</span>
            </div>
          )}
          {blog.status && (
            <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${statusColors[blog.status] || 'bg-muted'}`}>
              {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col h-52">
          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {blog.title}
          </h3>

          <p className="text-sm text-foreground-secondary mb-3 line-clamp-2 flex-grow">
            {blog.description}
          </p>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {blog.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-xs bg-background-secondary text-accent px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
              {blog.tags.length > 2 && (
                <span className="text-xs text-muted">+{blog.tags.length - 2}</span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted border-t border-border pt-3">
            <span>{blog.author?.username || 'Unknown'}</span>
            <span>{formatDateRelative(blog.created_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
