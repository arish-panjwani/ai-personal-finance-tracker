"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, TrendingUp, Activity, Eye, EyeOff } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalTransactions: number
  totalVolume: number
  userGrowth: Array<{ date: string; users: number }>
  transactionGrowth: Array<{ date: string; transactions: number }>
  userEngagement: Array<{ name: string; email: string; transactions: number; lastActive: string }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showUserDetails, setShowUserDetails] = useState(false)

  useEffect(() => {
    loadAdminStats()
  }, [])

  const loadAdminStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to load admin stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-600 mt-2">Unable to load statistics</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor user engagement and platform metrics</p>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Admin Panel
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                  <p className="text-sm text-green-600">+12% from last month</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
                  <p className="text-sm text-green-600">+8% from last week</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalTransactions.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+25% from last month</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Volume</p>
                  <p className="text-3xl font-bold text-gray-900">${stats.totalVolume.toLocaleString()}</p>
                  <p className="text-sm text-green-600">+18% from last month</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>User Growth Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.transactionGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="transactions" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Engagement Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>User Engagement</CardTitle>
              <Button
                variant="outline"
                onClick={() => setShowUserDetails(!showUserDetails)}
                className="flex items-center gap-2"
              >
                {showUserDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showUserDetails ? "Hide Details" : "Show Details"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">User</th>
                    <th className="text-left p-2">Transactions</th>
                    <th className="text-left p-2">Last Active</th>
                    <th className="text-left p-2">Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.userEngagement.map((user, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          {showUserDetails && <p className="text-sm text-gray-500">{user.email}</p>}
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge variant="outline">{user.transactions}</Badge>
                      </td>
                      <td className="p-2 text-sm text-gray-600">{new Date(user.lastActive).toLocaleDateString()}</td>
                      <td className="p-2">
                        <Badge
                          variant={user.transactions > 10 ? "default" : user.transactions > 5 ? "secondary" : "outline"}
                        >
                          {user.transactions > 10 ? "High" : user.transactions > 5 ? "Medium" : "Low"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Users className="h-6 w-6 mb-2" />
                Export User Data
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <TrendingUp className="h-6 w-6 mb-2" />
                Generate Report
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Activity className="h-6 w-6 mb-2" />
                Send Notifications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
