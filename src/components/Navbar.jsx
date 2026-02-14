import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-40 glassmorphism border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              BlogHub
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            
            {user && (
              <Link 
                to="/create" 
                className="text-foreground hover:text-secondary transition-colors"
              >
                Write
              </Link>
            )}

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="px-3 py-1 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-sm"
                    >
                      Admin
                    </Link>
                  )}
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.avatar || 'https://via.placeholder.com/40'} 
                      alt={user.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-foreground">{user.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg bg-background-secondary hover:bg-primary/20 transition-colors text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className="px-4 py-2 rounded-lg bg-background-secondary hover:bg-primary/20 transition-colors text-sm"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register"
                    className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark transition-colors text-white text-sm"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-foreground hover:text-primary transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-4">
            <Link 
              to="/"
              className="block px-4 py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            {user && (
              <>
                <Link 
                  to="/create"
                  className="block px-4 py-2 text-foreground hover:text-secondary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Write
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin"
                    className="block px-4 py-2 text-primary hover:text-accent transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
              </>
            )}

            <div className="px-4 space-y-2 border-t border-border pt-4">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 rounded-lg bg-background-secondary hover:bg-primary/20 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className="block text-center px-4 py-2 rounded-lg bg-background-secondary hover:bg-primary/20 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register"
                    className="block text-center px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark transition-colors text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
