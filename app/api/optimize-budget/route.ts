import { type NextRequest, NextResponse } from "next/server"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: string
}

export async function POST(request: NextRequest) {
  try {
    const { transactions }: { transactions: Transaction[] } = await request.json()

    if (!transactions || transactions.length === 0) {
      return NextResponse.json({ error: "No transactions provided" }, { status: 400 })
    }

    // Calculate financial summary
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

    // Always use rule-based suggestions for demo
    const suggestions = generateRuleBasedSuggestions(transactions, totalIncome, totalExpenses, expensesByCategory)
    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("Error generating budget optimization:", error)
    return NextResponse.json({ error: "Failed to generate optimization suggestions" }, { status: 500 })
  }
}

function generateRuleBasedSuggestions(
  transactions: Transaction[],
  totalIncome: number,
  totalExpenses: number,
  expensesByCategory: Record<string, number>,
): string {
  const balance = totalIncome - totalExpenses
  const suggestions: string[] = []

  // Analyze spending patterns
  const sortedExpenses = Object.entries(expensesByCategory).sort(([, a], [, b]) => b - a)
  const topCategory = sortedExpenses[0]
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

  // Header
  suggestions.push("💡 AI-Powered Budget Optimization\n")

  // Balance analysis
  if (balance < 0) {
    suggestions.push("🚨 URGENT: You're spending more than you earn!")
    suggestions.push("• Immediately reduce non-essential expenses")
    suggestions.push("• Consider additional income sources")
    suggestions.push("• Review all subscriptions and memberships\n")
  } else if (savingsRate < 10) {
    suggestions.push("⚠️ Your savings rate is below recommended 20%")
    suggestions.push("• Try to save at least 10-20% of your income")
    suggestions.push("• Automate savings to make it easier\n")
  } else if (savingsRate >= 20) {
    suggestions.push("🌟 Excellent! You're saving over 20% of income")
    suggestions.push("• Consider investing your surplus")
    suggestions.push("• Look into retirement accounts (401k, IRA)\n")
  } else {
    suggestions.push("✅ Good job maintaining a positive balance!")
    suggestions.push("• Aim to increase savings rate to 20%\n")
  }

  // Top spending category analysis
  if (topCategory) {
    const [category, amount] = topCategory
    const percentage = ((amount / totalExpenses) * 100).toFixed(1)
    suggestions.push(`💰 Your biggest expense: ${category} (${percentage}% of spending)`)

    // Category-specific advice
    switch (category.toLowerCase()) {
      case "food":
        suggestions.push("🍽️ Food Optimization Tips:")
        suggestions.push("• Meal plan and prep on weekends")
        suggestions.push("• Cook at home 5+ days per week")
        suggestions.push("• Use grocery store apps for discounts")
        suggestions.push("• Buy generic brands for 20-30% savings")
        break
      case "entertainment":
        suggestions.push("🎬 Entertainment Budget Tips:")
        suggestions.push("• Set a monthly entertainment budget")
        suggestions.push("• Look for free community events")
        suggestions.push("• Share streaming subscriptions with family")
        suggestions.push("• Take advantage of happy hours and matinee prices")
        break
      case "shopping":
        suggestions.push("🛍️ Smart Shopping Strategies:")
        suggestions.push("• Use the 24-hour rule before purchases")
        suggestions.push("• Compare prices across multiple stores")
        suggestions.push("• Shop with a list to avoid impulse buys")
        suggestions.push("• Consider buying used or refurbished items")
        break
      case "transportation":
        suggestions.push("🚗 Transportation Savings:")
        suggestions.push("• Combine errands into single trips")
        suggestions.push("• Consider carpooling or public transport")
        suggestions.push("• Maintain your vehicle for better fuel efficiency")
        suggestions.push("• Walk or bike for short distances")
        break
      case "bills":
        suggestions.push("📄 Bill Optimization:")
        suggestions.push("• Review and cancel unused subscriptions")
        suggestions.push("• Negotiate with service providers")
        suggestions.push("• Switch to more affordable plans")
        suggestions.push("• Bundle services for discounts")
        break
      default:
        suggestions.push(`• Try to reduce ${category} expenses by 10-15%`)
        suggestions.push("• Look for alternatives or better deals")
        break
    }
    suggestions.push("")
  }

  // Transaction pattern analysis
  const recentTransactions = transactions.slice(0, 20)
  const smallExpenses = recentTransactions.filter((t) => t.type === "expense" && t.amount < 25).length
  const largeExpenses = recentTransactions.filter((t) => t.type === "expense" && t.amount > 200).length

  if (smallExpenses > 8) {
    suggestions.push("☕ Small Expense Alert:")
    suggestions.push("• You have many small purchases that add up")
    suggestions.push("• Track daily spending like coffee, snacks, apps")
    suggestions.push("• Consider a 'small purchase' weekly budget\n")
  }

  if (largeExpenses > 3) {
    suggestions.push("💳 Large Purchase Pattern:")
    suggestions.push("• You have several large expenses")
    suggestions.push("• Plan major purchases in advance")
    suggestions.push("• Research and compare before buying\n")
  }

  // Seasonal advice
  const currentMonth = new Date().getMonth()
  if (currentMonth === 11 || currentMonth === 0) {
    // December or January
    suggestions.push("🎄 Holiday Season Tips:")
    suggestions.push("• Set a holiday spending budget")
    suggestions.push("• Start saving for next year's holidays")
    suggestions.push("• Look for post-holiday sales\n")
  }

  // Income vs expense ratio advice
  const expenseRatio = totalExpenses / totalIncome
  if (expenseRatio > 0.8) {
    suggestions.push("⚡ Quick Wins to Try This Week:")
    suggestions.push("• Cancel one unused subscription")
    suggestions.push("• Cook dinner at home 3 extra times")
    suggestions.push("• Find one free activity instead of paid entertainment")
    suggestions.push("• Use coupons for your next grocery trip\n")
  }

  // Positive reinforcement and motivation
  if (balance > 0) {
    suggestions.push(`🎉 You're saving $${balance.toFixed(2)} this period!`)
    if (balance > 500) {
      suggestions.push("• Consider investing this surplus")
      suggestions.push("• Build an emergency fund (3-6 months expenses)")
    }
    suggestions.push("• Keep up the excellent work!\n")
  }

  // Final actionable tip
  suggestions.push("📈 Next Steps:")
  suggestions.push("• Review your spending weekly")
  suggestions.push("• Set monthly budgets for each category")
  suggestions.push("• Track progress and celebrate small wins")
  suggestions.push("• Consider using the 50/30/20 rule: 50% needs, 30% wants, 20% savings")

  return suggestions.join("\n")
}
