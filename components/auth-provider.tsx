"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name: string
  age?: number
  occupation?: string
  company?: string
  industry?: string
  annualIncome?: number
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (
    email: string,
    password: string,
    name: string,
    age?: number,
    occupation?: string,
    company?: string,
    industry?: string,
    annualIncome?: number,
  ) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("auth-token")
      console.log("Checking auth with token:", token)

      if (!token) {
        console.log("No token found")
        setLoading(false)
        return
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Auth check response:", response.status)

      if (response.ok) {
        const userData = await response.json()
        console.log("Auth check successful:", userData)
        setUser(userData)
      } else {
        console.log("Auth check failed, removing token")
        localStorage.removeItem("auth-token")
      }
    } catch (error) {
      console.error("Auth check error:", error)
      localStorage.removeItem("auth-token")
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting login:", email)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log("Login response status:", response.status)

      if (response.ok) {
        const { token, user: userData } = await response.json()
        console.log("Login successful:", { token, userData })

        localStorage.setItem("auth-token", token)
        setUser(userData)
        return true
      } else {
        const error = await response.json()
        console.log("Login failed:", error)
        return false
      }
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const signup = async (
    email: string,
    password: string,
    name: string,
    age?: number,
    occupation?: string,
    company?: string,
    industry?: string,
    annualIncome?: number,
  ): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          age,
          occupation,
          company,
          industry,
          annualIncome,
        }),
      })

      if (response.ok) {
        const { token, user: userData } = await response.json()
        localStorage.setItem("auth-token", token)
        setUser(userData)
        return true
      }
      return false
    } catch (error) {
      console.error("Signup error:", error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("auth-token")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
