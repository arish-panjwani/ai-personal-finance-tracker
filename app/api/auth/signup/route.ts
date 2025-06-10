import { type NextRequest, NextResponse } from "next/server"

// Simple in-memory storage for demo
const users: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, age, occupation, company, industry, annualIncome } = await request.json()

    console.log("Signup attempt:", email)

    // Check if user exists
    if (email === "demo@example.com" || users.find((u) => u.email === email)) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create user
    const user = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      age,
      occupation,
      company,
      industry,
      annualIncome,
      createdAt: new Date().toISOString(),
    }

    users.push(user)

    const token = `token-${Date.now()}`

    // Return without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
