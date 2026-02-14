import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-background-secondary border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">BlogHub</h3>
              <p className="text-muted text-sm">
                Share your stories and inspire others with your thoughts.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Navigation</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href="#guidelines" className="hover:text-primary transition-colors">Guidelines</a></li>
                <li><a href="#safety" className="hover:text-primary transition-colors">Safety</a></li>
                <li><a href="#support" className="hover:text-primary transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href="#privacy" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#terms" className="hover:text-primary transition-colors">Terms</a></li>
                <li><a href="#cookies" className="hover:text-primary transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted">
            <p>&copy; 2024 BlogHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
