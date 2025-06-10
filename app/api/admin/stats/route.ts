import { NextResponse } from "next/server"

// Mock data for admin dashboard
export async function GET() {
  // In a real app, this would query your database
  const mockStats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalTransactions: 15634,
    totalVolume: 2847392,
    userGrowth: [
      { date: "2024-01", users: 100 },
      { date: "2024-02", users: 250 },
      { date: "2024-03", users: 450 },
      { date: "2024-04", users: 680 },
      { date: "2024-05", users: 920 },
      { date: "2024-06", users: 1247 },
    ],
    transactionGrowth: [
      { date: "2024-06-01", transactions: 45 },
      { date: "2024-06-02", transactions: 52 },
      { date: "2024-06-03", transactions: 38 },
      { date: "2024-06-04", transactions: 67 },
      { date: "2024-06-05", transactions: 71 },
      { date: "2024-06-06", transactions: 59 },
      { date: "2024-06-07", transactions: 83 },
    ],
    userEngagement: [
      { name: "John Doe", email: "john@example.com", transactions: 45, lastActive: "2024-06-07" },
      { name: "Jane Smith", email: "jane@example.com", transactions: 32, lastActive: "2024-06-06" },
      { name: "Mike Johnson", email: "mike@example.com", transactions: 28, lastActive: "2024-06-05" },
      { name: "Sarah Wilson", email: "sarah@example.com", transactions: 19, lastActive: "2024-06-04" },
      { name: "Tom Brown", email: "tom@example.com", transactions: 15, lastActive: "2024-06-03" },
      { name: "Lisa Davis", email: "lisa@example.com", transactions: 12, lastActive: "2024-06-02" },
      { name: "Chris Miller", email: "chris@example.com", transactions: 8, lastActive: "2024-06-01" },
      { name: "Amy Taylor", email: "amy@example.com", transactions: 6, lastActive: "2024-05-30" },
    ],
  }

  return NextResponse.json(mockStats)
}
