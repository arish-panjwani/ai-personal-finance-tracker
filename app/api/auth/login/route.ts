import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("Login attempt:", email, password)

    // Simple demo authentication
    if (email === "demo@example.com" && password === "password") {
      const user = {
        id: "demo-user-1",
        email: "demo@example.com",
        name: "Demo User",
        age: 30,
        occupation: "Software Developer",
        company: "Tech Corp",
        industry: "Technology",
        annualIncome: 75000,
        createdAt: "2024-01-01T00:00:00.000Z",
      }

      // Simple token (in production, use proper JWT)
      const token = `demo-token-${Date.now()}`

      console.log("Login successful, returning:", { token, user })

      return NextResponse.json({
        token,
        user,
      })
    }

    console.log("Invalid credentials")
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
