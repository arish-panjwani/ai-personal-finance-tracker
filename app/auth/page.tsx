"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { toast } from "@/hooks/use-toast"
import { DollarSign, TrendingUp, Shield, BarChart3, Copy } from "lucide-react"

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Real Estate",
  "Consulting",
  "Government",
  "Non-profit",
  "Other",
]

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    age: "",
    occupation: "",
    company: "",
    industry: "",
    annualIncome: "",
  })
  const { login, signup } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(loginData.email, loginData.password)

      if (success) {
        toast({
          title: "Welcome back!",
          description: "You've been successfully logged in.",
        })
        router.push("/")
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const success = await signup(
        signupData.email,
        signupData.password,
        signupData.name,
        signupData.age ? Number.parseInt(signupData.age) : undefined,
        signupData.occupation,
        signupData.company,
        signupData.industry,
        signupData.annualIncome ? Number.parseFloat(signupData.annualIncome) : undefined,
      )

      if (success) {
        toast({
          title: "Account created!",
          description: "Welcome to Budget Tracker!",
        })
        router.push("/")
      } else {
        toast({
          title: "Signup failed",
          description: "Email might already be in use. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Signup error:", error)
      toast({
        title: "Signup failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const fillDemoCredentials = () => {
    setLoginData({ email: "demo@example.com", password: "password" })
    toast({
      title: "Demo credentials filled",
      description: "Click 'Sign In' to continue with the demo account.",
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Copied to clipboard",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Budget Tracker</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Take control of your finances with AI-powered insights
          </p>
        </div>

        {/* Demo Account Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Try Demo Account</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={fillDemoCredentials}
              className="text-blue-700 border-blue-300 hover:bg-blue-100 dark:text-blue-300 dark:border-blue-600 dark:hover:bg-blue-800"
            >
              Auto Fill
            </Button>
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
            <div className="flex items-center justify-between">
              <span>
                <strong>Email:</strong> demo@example.com
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard("demo@example.com")}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span>
                <strong>Password:</strong> password
              </span>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard("password")} className="h-6 w-6 p-0">
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <TrendingUp className="h-6 w-6 text-blue-600 mx-auto" />
            <p className="text-xs text-gray-600 dark:text-gray-400">Track Expenses</p>
          </div>
          <div className="space-y-2">
            <BarChart3 className="h-6 w-6 text-green-600 mx-auto" />
            <p className="text-xs text-gray-600 dark:text-gray-400">Deep Analytics</p>
          </div>
          <div className="space-y-2">
            <Shield className="h-6 w-6 text-purple-600 mx-auto" />
            <p className="text-xs text-gray-600 dark:text-gray-400">AI Insights</p>
          </div>
        </div>

        {/* Auth Forms */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-center dark:text-white">Get Started</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="signup-name">Full Name *</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Your name"
                        value={signupData.name}
                        onChange={(e) => setSignupData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-age">Age</Label>
                      <Input
                        id="signup-age"
                        type="number"
                        placeholder="25"
                        value={signupData.age}
                        onChange={(e) => setSignupData((prev) => ({ ...prev, age: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-email">Email *</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupData.email}
                      onChange={(e) => setSignupData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="signup-password">Password *</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create password"
                        value={signupData.password}
                        onChange={(e) => setSignupData((prev) => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-confirm">Confirm *</Label>
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="Confirm password"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-occupation">Occupation</Label>
                    <Input
                      id="signup-occupation"
                      type="text"
                      placeholder="Software Developer"
                      value={signupData.occupation}
                      onChange={(e) => setSignupData((prev) => ({ ...prev, occupation: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="signup-company">Company</Label>
                      <Input
                        id="signup-company"
                        type="text"
                        placeholder="Company name"
                        value={signupData.company}
                        onChange={(e) => setSignupData((prev) => ({ ...prev, company: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-industry">Industry</Label>
                      <Select
                        value={signupData.industry}
                        onValueChange={(value) => setSignupData((prev) => ({ ...prev, industry: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-income">Annual Income (Optional)</Label>
                    <Input
                      id="signup-income"
                      type="number"
                      placeholder="50000"
                      value={signupData.annualIncome}
                      onChange={(e) => setSignupData((prev) => ({ ...prev, annualIncome: e.target.value }))}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
