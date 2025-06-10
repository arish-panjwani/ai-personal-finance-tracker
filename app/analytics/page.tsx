"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, LucidePieChart } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  BarChart,
  Bar,
  Cell,
} from "recharts"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export default function AnalyticsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadTransactions()
    }
  }, [user])

  const loadTransactions = async () => {
    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch("/api/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
      }
    } catch (error) {
      console.error("Failed to load transactions:", error)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Prepare data for charts
  const monthlyData = transactions.reduce(
    (acc, transaction) => {
      const month = new Date(transaction.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      if (!acc[month]) {
        acc[month] = { month, income: 0, expenses: 0 }
      }
      if (transaction.type === "income") {
        acc[month].income += transaction.amount
      } else {
        acc[month].expenses += transaction.amount
      }
      return acc
    },
    {} as Record<string, { month: string; income: number; expenses: number }>,
  )

  const monthlyChartData = Object.values(monthlyData).sort(
    (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime(),
  )

  const categoryData = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
        return acc
      },
      {} as Record<string, number>,
    )

  const pieChartData = Object.entries(categoryData).map(([name, value]) => ({ name, value }))

  const dailySpending = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, transaction) => {
        const date = transaction.date
        acc[date] = (acc[date] || 0) + transaction.amount
        return acc
      },
      {} as Record<string, number>,
    )

  const dailyChartData = Object.entries(dailySpending)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30) // Last 30 days

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const avgDailySpending = totalExpenses / Math.max(dailyChartData.length, 1)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Deep Analytics</h1>
            <p className="text-gray-600">Advanced insights into your spending patterns</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Income</p>
                  <p className="text-xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="text-xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
                </div>
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Daily Spending</p>
                  <p className="text-xl font-bold text-blue-600">${avgDailySpending.toFixed(2)}</p>
                </div>
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Categories</p>
                  <p className="text-xl font-bold text-purple-600">{Object.keys(categoryData).length}</p>
                </div>
                <LucidePieChart className="h-6 w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Income vs Expenses */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, ""]} />
                    <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} name="Income" />
                    <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} name="Expenses" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Expense Categories Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Daily Spending Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Spending (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value) => [`$${Number(value).toFixed(2)}`, "Spent"]}
                    />
                    <Bar dataKey="amount" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Spending Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Spending Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">Highest Spending Day</span>
                  <span className="text-sm font-bold text-blue-600">
                    ${Math.max(...Object.values(dailySpending)).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">Lowest Spending Day</span>
                  <span className="text-sm font-bold text-green-600">
                    ${Math.min(...Object.values(dailySpending)).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium">Most Expensive Category</span>
                  <span className="text-sm font-bold text-purple-600">
                    {Object.entries(categoryData).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium">Savings Rate</span>
                  <span className="text-sm font-bold text-orange-600">
                    {totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
