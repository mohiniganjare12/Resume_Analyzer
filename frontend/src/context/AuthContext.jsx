import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

// axios.defaults.baseURL = 'https://resume-analyzer-lr5d.onrender.com'

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const setToken = (token) => {
    if (token) {
      localStorage.setItem('riq_token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      localStorage.removeItem('riq_token')
      delete axios.defaults.headers.common['Authorization']
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('riq_token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.get('/auth/me')
        .then(r => setUser(r.data))
        .catch(() => setToken(null))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const r = await axios.post('/auth/login', { email, password })
    setToken(r.data.token)
    setUser(r.data.user)
    return r.data
  }, [])

  const register = useCallback(async (name, email, password) => {
    const r = await axios.post('/auth/register', { name, email, password })
    setToken(r.data.token)
    setUser(r.data.user)
    return r.data
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}