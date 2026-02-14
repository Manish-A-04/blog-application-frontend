import React from 'react'

export function Spinner({ className = 'w-8 h-8' }) {
  return (
    <div className={`animate-spin rounded-full border-2 border-border border-t-primary ${className}`} />
  )
}

export function LoadingCard() {
  return (
    <div className="bg-background-secondary rounded-lg p-6 space-y-4">
      <div className="h-6 bg-border rounded w-3/4 animate-pulse"></div>
      <div className="h-4 bg-border rounded w-full animate-pulse"></div>
      <div className="h-4 bg-border rounded w-full animate-pulse"></div>
      <div className="h-4 bg-border rounded w-1/2 animate-pulse"></div>
    </div>
  )
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  )
}
