import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    console.log("Auth header:", authHeader)

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    console.log("Token:", token)

    // Simple token validation for demo
    if (token.startsWith("demo-token-")) {
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

      console.log("Token valid, returning user:", user)
      return NextResponse.json(user)
    }

    console.log("Invalid token")
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  } catch (error) {
    console.error("Auth verification error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
