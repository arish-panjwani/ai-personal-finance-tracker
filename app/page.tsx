"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PlusCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Trash2,
  User,
  LogOut,
  BarChart3,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { useTheme } from "@/components/theme-provider"
import { LoadingWithQuote } from "@/components/financial-quotes"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
}

const categories = {
  income: ["Salary", "Freelance", "Investment", "Other Income"],
  expense: ["Food", "Transportation", "Entertainment", "Shopping", "Bills", "Healthcare", "Other"],
}

export default function BudgetTracker() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isAddingTransaction, setIsAddingTransaction] = useState(false)
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<string>("")
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [showOptimization, setShowOptimization] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const { theme, toggleTheme } = useTheme()

  // Form state
  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    amount: "",
    category: "",
    description: "",
  })

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  // Load transactions from API
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

  const addTransaction = async () => {
    if (!formData.amount || !formData.category || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: formData.type,
          amount: Number.parseFloat(formData.amount),
          category: formData.category,
          description: formData.description,
        }),
      })

      if (response.ok) {
        const newTransaction = await response.json()
        setTransactions((prev) => [newTransaction, ...prev])
        setFormData({
          type: "expense",
          amount: "",
          category: "",
          description: "",
        })
        setIsAddingTransaction(false)

        toast({
          title: "Transaction Added",
          description: `${formData.type === "income" ? "Income" : "Expense"} of $${formData.amount} added successfully`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      })
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setTransactions((prev) => prev.filter((t) => t.id !== id))
        toast({
          title: "Transaction Deleted",
          description: "Transaction removed successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      })
    }
  }

  const optimizeBudget = async () => {
    setIsOptimizing(true)

    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch("/api/optimize-budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ transactions }),
      })

      if (!response.ok) {
        throw new Error("Failed to get optimization suggestions")
      }

      const data = await response.json()
      setOptimizationSuggestions(data.suggestions)
      setShowOptimization(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate optimization suggestions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/auth")
  }

  if (loading) {
    return <LoadingWithQuote message="Loading your financial dashboard..." />
  }

  if (!user) {
    return null
  }

  // Calculate totals
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpenses

  // Group expenses by category
  const expensesByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      },
      {} as Record<string, number>,
    )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budget Tracker</h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome back, {user.name}!</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowProfile(true)}>
              <User className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              {theme === "dark" ? "☀️" : "🌙"}
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
                  <p className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                    ${balance.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Income</p>
                    <p className="text-lg font-semibold text-green-600">${totalIncome.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Expenses</p>
                    <p className="text-lg font-semibold text-red-600">${totalExpenses.toFixed(2)}</p>
                  </div>
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Optimize Budget Button */}
        {transactions.length >= 3 && (
          <Card className="border-orange-200 bg-orange-50 dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-orange-800 dark:text-orange-400">Ready to optimize!</p>
                  <p className="text-sm text-orange-600 dark:text-orange-300">Get AI-powered budget suggestions</p>
                </div>
                <Button
                  onClick={optimizeBudget}
                  disabled={isOptimizing}
                  className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800"
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  {isOptimizing ? "Analyzing..." : "Optimize"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Transaction Button */}
        <Dialog open={isAddingTransaction} onOpenChange={setIsAddingTransaction}>
          <DialogTrigger asChild>
            <Button className="w-full" size="lg">
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm mx-auto dark:bg-gray-800 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
              <DialogDescription>Add a new income or expense transaction to track your finances.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "income" | "expense") =>
                    setFormData((prev) => ({ ...prev, type: value, category: "" }))
                  }
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:text-gray-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:text-gray-50">
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                  className="dark:bg-gray-700 dark:text-gray-50"
                />
              </div>

              <div>
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="dark:bg-gray-700 dark:text-gray-50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:text-gray-50">
                    {categories[formData.type].map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="dark:bg-gray-700 dark:text-gray-50"
                />
              </div>

              <Button onClick={addTransaction} className="w-full">
                Add Transaction
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Navigation Tabs */}
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="deep-analytics">
              <BarChart3 className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            {transactions.length === 0 ? (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Add your first transaction to get started</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <Card key={transaction.id} className="dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={transaction.type === "income" ? "default" : "secondary"}>
                              {transaction.category}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{transaction.date}</span>
                          </div>
                          <p className="font-medium dark:text-gray-50">{transaction.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                          >
                            {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTransaction(transaction.id)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg dark:text-white">Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(expensesByCategory).length === 0 ? (
                  <p className="text-gray-500 text-center py-4 dark:text-gray-400">No expense data available</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(expensesByCategory)
                      .sort(([, a], [, b]) => b - a)
                      .map(([category, amount]) => (
                        <div key={category} className="flex items-center justify-between">
                          <span className="text-sm font-medium dark:text-gray-50">{category}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                  width: `${(amount / totalExpenses) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-semibold dark:text-gray-50">${amount.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deep-analytics" className="space-y-4">
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 dark:text-gray-50">Deep Analytics</h3>
              <p className="text-gray-600 mb-4 dark:text-gray-400">Advanced charts and insights!</p>
              <Button
                onClick={() => router.push("/analytics")}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                View Full Analytics
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <User className="h-5 w-5" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">Name</Label>
                  <p className="font-medium dark:text-gray-50">{user.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">Email</Label>
                  <p className="font-medium dark:text-gray-50">{user.email}</p>
                </div>
                {user.occupation && (
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">Occupation</Label>
                    <p className="font-medium dark:text-gray-50">{user.occupation}</p>
                  </div>
                )}
                {user.company && (
                  <div>
                    <Label className="text-sm text-gray-600 dark:text-gray-400">Company</Label>
                    <p className="font-medium dark:text-gray-50">{user.company}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">Member Since</Label>
                  <p className="font-medium dark:text-gray-50">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</Label>
                  <p className="font-medium dark:text-gray-50">{transactions.length}</p>
                </div>
                <Button onClick={handleLogout} variant="destructive" className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Optimization Results Dialog */}
        <Dialog open={showOptimization} onOpenChange={setShowOptimization}>
          <DialogContent className="max-w-sm mx-auto max-h-[80vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 dark:text-white">
                <Lightbulb className="h-5 w-5 text-orange-600" />
                Budget Optimization
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                AI-powered suggestions to improve your financial health
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg dark:bg-gray-700">
                <p className="text-sm text-orange-800 whitespace-pre-wrap dark:text-orange-400">
                  {optimizationSuggestions}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
