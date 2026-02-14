
import React, { createContext, useState, useEffect } from 'react'
import axios from '../api/axiosInstance'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
    }

    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      const response = await axios.post('/auth/login', { email, password })
      const { user: userData, access_token } = response.data
      const token = access_token

      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', token)

      setUser(userData)
      return userData
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed'
      setError(message)
      throw new Error(message)
    }
  }

  const register = async (username, email, password) => {
    try {
      setError(null)
      const response = await axios.post('/auth/register', {
        username,
        email,
        password,
        role: 'user'
      })
      const { user: userData, access_token } = response.data
      const token = access_token

      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', token)

      setUser(userData)
      return userData
    } catch (err) {
      console.log('Registration Error Response:', err.response)
      const message = err.response?.data?.detail || err.response?.data?.message || 'Registration failed'
      // ...
      setError(message)
      throw new Error(message)
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    setError(null)
  }


  const updateProfile = async (profileData) => {
    try {
      setError(null)
      const response = await axios.put('/users/me', profileData)
      const updatedUser = response.data

      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      return updatedUser
    } catch (err) {
      const message = err.response?.data?.message || 'Update failed'
      setError(message)
      throw new Error(message)
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
