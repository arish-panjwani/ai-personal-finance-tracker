import { type NextRequest, NextResponse } from "next/server"

// Simple in-memory storage for demo
const transactions: any[] = [
  {
    id: "demo-1",
    userId: "demo-user-1",
    type: "income",
    amount: 5000,
    category: "Salary",
    description: "Monthly salary",
    date: "2024-06-01",
  },
  {
    id: "demo-2",
    userId: "demo-user-1",
    type: "expense",
    amount: 1200,
    category: "Bills",
    description: "Rent payment",
    date: "2024-06-02",
  },
  {
    id: "demo-3",
    userId: "demo-user-1",
    type: "expense",
    amount: 300,
    category: "Food",
    description: "Groceries",
    date: "2024-06-03",
  },
]

function getUserIdFromToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)

  // Simple token validation
  if (token.startsWith("demo-token-")) {
    return "demo-user-1"
  }

  if (token.startsWith("token-")) {
    // Extract user ID from token (in real app, decode JWT)
    return token.replace("token-", "user-")
  }

  return null
}

export async function GET(request: NextRequest) {
  const userId = getUserIdFromToken(request)
  console.log("GET transactions for user:", userId)

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userTransactions = transactions
    .filter((t) => t.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  console.log("Returning transactions:", userTransactions)
  return NextResponse.json(userTransactions)
}

export async function POST(request: NextRequest) {
  const userId = getUserIdFromToken(request)
  console.log("POST transaction for user:", userId)

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { type, amount, category, description } = await request.json()

    const transaction = {
      id: `trans-${Date.now()}`,
      userId,
      type,
      amount,
      category,
      description,
      date: new Date().toISOString().split("T")[0],
    }

    transactions.push(transaction)
    console.log("Created transaction:", transaction)

    return NextResponse.json(transaction)
  } catch (error) {
    console.error("Transaction creation error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
