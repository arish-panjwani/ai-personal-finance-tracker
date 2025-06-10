import { type NextRequest, NextResponse } from "next/server"

// Import the same transactions array (in real app, use database)
const transactions: any[] = []

function getUserIdFromToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)

  if (token.startsWith("demo-token-")) {
    return "demo-user-1"
  }

  if (token.startsWith("token-")) {
    return token.replace("token-", "user-")
  }

  return null
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = getUserIdFromToken(request)

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const index = transactions.findIndex((t) => t.id === params.id && t.userId === userId)

  if (index === -1) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
  }

  transactions.splice(index, 1)
  return NextResponse.json({ success: true })
}
