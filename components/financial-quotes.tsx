"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const financialQuotes = [
  {
    quote: "The stock market is filled with individuals who know the price of everything, but the value of nothing.",
    author: "Philip Fisher",
  },
  {
    quote:
      "It's not how much money you make, but how much money you keep, how hard it works for you, and how many generations you keep it for.",
    author: "Robert Kiyosaki",
  },
  {
    quote: "The real measure of your wealth is how much you'd be worth if you lost all your money.",
    author: "Anonymous",
  },
  {
    quote: "Don't save what is left after spending; spend what is left after saving.",
    author: "Warren Buffett",
  },
  {
    quote:
      "The habit of saving is itself an education; it fosters every virtue, teaches self-denial, cultivates the sense of order, trains to forethought, and so broadens the mind.",
    author: "T.T. Munger",
  },
  {
    quote: "A budget is telling your money where to go instead of wondering where it went.",
    author: "Dave Ramsey",
  },
  {
    quote: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
  },
  {
    quote: "Price is what you pay. Value is what you get.",
    author: "Warren Buffett",
  },
  {
    quote: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin",
  },
  {
    quote: "The most important investment you can make is in yourself.",
    author: "Warren Buffett",
  },
]

interface FinancialQuotesProps {
  className?: string
}

export function FinancialQuotes({ className = "" }: FinancialQuotesProps) {
  const [currentQuote, setCurrentQuote] = useState(financialQuotes[0])

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * financialQuotes.length)
      setCurrentQuote(financialQuotes[randomIndex])
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className={`border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800 ${className}`}>
      <CardContent className="p-6 text-center">
        <Quote className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <blockquote className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
          "{currentQuote.quote}"
        </blockquote>
        <cite className="text-sm text-blue-700 dark:text-blue-300">— {currentQuote.author}</cite>
      </CardContent>
    </Card>
  )
}

export function LoadingWithQuote({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        </div>
        <FinancialQuotes />
      </div>
    </div>
  )
}
