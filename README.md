# 💰 Budget Tracker - AI-Powered Personal Finance Management

A comprehensive, mobile-first budget tracking application built with Next.js, featuring AI-powered insights, deep analytics, and a beautiful dark theme. Track your expenses, analyze spending patterns, and get personalized financial advice to optimize your budget.

![Budget Tracker](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)

## 🌟 Features

### 🔐 Authentication & User Management
- **Secure JWT-based authentication** with login/signup
- **Comprehensive user profiles** with demographics collection
- **Customer data collection**: Age, occupation, company, industry, annual income
- **Demo account** for instant testing (`demo@example.com` / `password`)
- **Persistent sessions** with automatic token refresh

### 💸 Transaction Management
- **Add income and expense transactions** with categorization
- **Real-time balance calculation** and financial summaries
- **Transaction categories**: Food, Transportation, Entertainment, Shopping, Bills, Healthcare
- **Income sources**: Salary, Freelance, Investment, Other Income
- **Delete and edit transactions** with confirmation
- **Date-based transaction tracking**

### 📊 Analytics & Insights
- **Basic Analytics**: Expense breakdown by category with visual progress bars
- **Deep Analytics**: Advanced charts and comprehensive financial insights
  - Monthly Income vs Expenses (Line Chart)
  - Expense Categories Distribution (Pie Chart)
  - Daily Spending Trends (Bar Chart)
  - Key Financial Metrics Dashboard
- **Spending pattern analysis** with actionable insights
- **Savings rate calculation** and recommendations

### 🤖 AI-Powered Budget Optimization
- **Intelligent budget analysis** with rule-based suggestions
- **Personalized financial advice** based on spending patterns
- **Category-specific recommendations** (food, entertainment, transportation, etc.)
- **Savings optimization tips** and goal setting
- **Seasonal financial advice** and spending alerts
- **Emergency fund and investment recommendations**

### 👨‍💼 Admin Dashboard
- **User engagement metrics** and platform statistics
- **Growth analytics** with user and transaction trends
- **User activity monitoring** with privacy controls
- **Platform health indicators** and key performance metrics
- **Export capabilities** for user data and reports

### 🎨 User Experience
- **Mobile-first responsive design** optimized for all devices
- **Dark/Light theme toggle** with persistent preferences
- **Financial quotes** during loading states for motivation
- **Intuitive navigation** with tabbed interface
- **Real-time notifications** and feedback
- **Accessibility-compliant** with proper ARIA labels

## 🚀 Quick Start

### Demo Account
Get started immediately with our demo account:
- **Email**: `demo@example.com`
- **Password**: `password`

The demo account comes pre-loaded with sample transactions to showcase all features.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/arish-panjwani/budget-tracker.git
   cd budget-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your environment variables:
   ```env
   JWT_SECRET=your-super-secret-jwt-key
   OPENAI_API_KEY=your-openai-api-key (optional)
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: JWT tokens, bcrypt password hashing
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **State Management**: React Context API
- **Storage**: LocalStorage (demo), Database-ready architecture

### Project Structure
```
budget-tracker/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/route.ts    # User login
│   │   │   ├── signup/route.ts   # User registration
│   │   │   └── me/route.ts       # Get current user
│   │   ├── transactions/         # Transaction management
│   │   │   ├── route.ts          # CRUD operations
│   │   │   └── [id]/route.ts     # Individual transaction
│   │   ├── optimize-budget/      # AI budget optimization
│   │   └── admin/                # Admin dashboard APIs
│   ├── auth/                     # Authentication pages
│   ├── analytics/                # Deep analytics page
│   ├── admin/                    # Admin dashboard
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main dashboard
│   └── globals.css               # Global styles
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   ├── auth-provider.tsx         # Authentication context
│   ├── theme-provider.tsx        # Theme management
│   └── financial-quotes.tsx      # Motivational quotes
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
└── scripts/                      # Database setup scripts
```

## 📱 Pages & Features

### 🏠 Main Dashboard (`/`)
- **Financial summary cards**: Balance, income, expenses
- **Quick transaction entry** with category selection
- **Recent transactions list** with delete functionality
- **Budget optimization trigger** (appears after 3+ transactions)
- **Navigation tabs**: Transactions, Analytics, Deep Analytics, Profile

### 🔐 Authentication (`/auth`)
- **Dual-mode interface**: Login and signup tabs
- **Comprehensive signup form** with demographics
- **Demo account integration** with auto-fill
- **Form validation** and error handling
- **Responsive design** with gradient background

### 📈 Deep Analytics (`/analytics`)
- **Advanced charting** with interactive visualizations
- **Monthly trends** showing income vs expenses over time
- **Category breakdown** with pie chart distribution
- **Daily spending patterns** with bar chart analysis
- **Key metrics dashboard** with financial health indicators
- **Spending insights** with highest/lowest spending days

### 👨‍💼 Admin Dashboard (`/admin`)
- **Platform statistics**: Total users, transactions, volume
- **User growth charts** with trend analysis
- **Engagement metrics** with user activity levels
- **Transaction volume tracking** with daily breakdowns
- **User management** with privacy-conscious data display

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user profile

### Transactions
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create new transaction
- `DELETE /api/transactions/[id]` - Delete transaction

### Budget Optimization
- `POST /api/optimize-budget` - Get AI-powered budget suggestions

### Admin
- `GET /api/admin/stats` - Get platform statistics

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INTEGER,
    occupation VARCHAR(255),
    company VARCHAR(255),
    industry VARCHAR(255),
    annual_income DECIMAL(12, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(10) CHECK (type IN ('income', 'expense')) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) - Trust and stability
- **Success**: Green (#10B981) - Income and positive actions
- **Warning**: Orange (#F59E0B) - Alerts and optimization
- **Danger**: Red (#EF4444) - Expenses and deletions
- **Neutral**: Gray scale for backgrounds and text

### Typography
- **Font Family**: Inter (system font fallback)
- **Headings**: Bold weights (600-700)
- **Body**: Regular weight (400)
- **Captions**: Light weight (300)

### Components
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Consistent padding, hover states
- **Forms**: Clear labels, validation states
- **Charts**: Consistent color scheme, responsive

## 🔒 Security Features

### Authentication Security
- **JWT tokens** with expiration
- **Password hashing** using bcrypt
- **Secure token storage** in localStorage
- **Automatic token refresh** on page load
- **Protected routes** with authentication checks

### Data Protection
- **User data isolation** - users only see their own data
- **Input validation** on all forms
- **SQL injection prevention** with parameterized queries
- **XSS protection** with proper data sanitization

## 📊 Analytics Features

### Financial Metrics
- **Total Income/Expenses** calculation
- **Current Balance** with color-coded status
- **Savings Rate** percentage calculation
- **Category Distribution** analysis
- **Spending Trends** over time
- **Average Daily Spending** computation

### Visualization Types
- **Line Charts**: Monthly income vs expenses trends
- **Pie Charts**: Expense category distribution
- **Bar Charts**: Daily spending patterns
- **Progress Bars**: Category spending percentages
- **Metric Cards**: Key financial indicators

## 🤖 AI Budget Optimization

### Analysis Categories
- **Spending Pattern Recognition**
- **Category-Specific Recommendations**
- **Savings Rate Optimization**
- **Emergency Fund Planning**
- **Investment Suggestions**
- **Seasonal Spending Advice**

### Recommendation Types
- **Immediate Actions**: Quick wins for this week
- **Long-term Strategies**: Building wealth over time
- **Category Optimization**: Specific tips per expense type
- **Behavioral Changes**: Habit formation suggestions
- **Goal Setting**: SMART financial objectives

## 🌙 Theme System

### Light Theme
- **Background**: Clean whites and light grays
- **Text**: Dark grays for optimal readability
- **Accents**: Vibrant colors for actions and data

### Dark Theme
- **Background**: Deep grays and blacks
- **Text**: Light grays and whites
- **Accents**: Muted but visible accent colors
- **Automatic**: System preference detection

## 📱 Mobile Optimization

### Responsive Design
- **Mobile-first approach** with progressive enhancement
- **Touch-friendly interfaces** with adequate tap targets
- **Optimized layouts** for small screens
- **Swipe gestures** for navigation
- **Fast loading** with optimized assets

### Performance
- **Code splitting** for faster initial loads
- **Image optimization** with Next.js Image component
- **Lazy loading** for non-critical components
- **Efficient re-renders** with React optimization

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on git push

### Manual Deployment
```bash
npm run build
npm start
```

### Environment Variables
```env
# Required
JWT_SECRET=your-super-secret-jwt-key

# Optional (for AI features)
OPENAI_API_KEY=your-openai-api-key

# Database (for production)
DATABASE_URL=your-database-connection-string
```

## 🧪 Testing

### Demo Data
The application includes comprehensive demo data:
- **Sample user**: Demo User with complete profile
- **Sample transactions**: 5+ transactions across categories
- **Realistic amounts**: Representative of actual spending
- **Date variety**: Transactions across multiple days

### Test Scenarios
1. **User Registration**: Create new account with demographics
2. **Transaction Management**: Add, view, delete transactions
3. **Analytics**: View charts with sufficient data
4. **Budget Optimization**: Get AI-powered suggestions
5. **Theme Switching**: Toggle between light/dark modes
6. **Mobile Usage**: Test on various screen sizes

## 🔮 Future Enhancements

### Planned Features
- **Real database integration** (PostgreSQL/MongoDB)
- **Email notifications** for budget alerts
- **Data export** (CSV, PDF reports)
- **Goal tracking** with progress visualization
- **Recurring transactions** automation
- **Multi-currency support**
- **Bank account integration** via Plaid
- **Investment tracking** portfolio management
- **Bill reminders** and due date tracking
- **Family sharing** and collaborative budgets

### Technical Improvements
- **Real-time updates** with WebSocket connections
- **Offline support** with service workers
- **Advanced caching** strategies
- **Performance monitoring** with analytics
- **A/B testing** framework
- **Internationalization** (i18n) support

## 🤝 Contributing

### Development Setup
1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper testing
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Code Standards
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Conventional Commits** for commit messages
- **Component documentation** with JSDoc

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful, accessible components
- **Tailwind CSS** for utility-first styling
- **Recharts** for powerful data visualization
- **Lucide** for consistent iconography
- **Next.js** for the amazing React framework
- **Vercel** for seamless deployment platform

## 📞 Support

### Demo Account
- **Email**: demo@example.com
- **Password**: password

### Documentation
- **API Documentation**: Available in code comments
- **Component Library**: shadcn/ui documentation
- **Deployment Guide**: Vercel documentation

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

*Transform your financial future with intelligent budget tracking and AI-powered insights.*
