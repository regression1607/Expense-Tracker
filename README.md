# 💰 Expense Tracker - Full Stack Application

A modern, full-stack expense tracking application built with Next.js, Node.js, Express, and MongoDB. Track your daily expenses, categorize them, and analyze your spending patterns with beautiful charts and insights.

## 🚀 Features

### 📱 Frontend (Next.js + TypeScript)
- **Modern UI**: Built with ShadCN/UI components and Tailwind CSS
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Three Main Views**:
  - **Dashboard**: Quick overview with recent expenses and add form
  - **Expenses**: Complete expense management with filters and search
  - **Analytics**: Visual insights with charts and spending patterns

### 🛠️ Backend (Node.js + Express)
- **RESTful API**: Complete CRUD operations for expenses
- **MVC Architecture**: Clean separation of concerns
- **Advanced Analytics**: Category-wise and time-based expense analytics
- **Robust Error Handling**: Comprehensive error handling and validation
- **Logging**: Winston-based logging system

### 💾 Database (MongoDB)
- **Document-based**: Flexible expense data storage
- **Docker Integration**: Easy setup with Docker Compose
- **Schema Validation**: Mongoose ODM with proper validation

## 📊 Expense Management

### Expense Fields
- **Amount**: Numeric input with decimal support (₹)
- **Category**: Dropdown options (Rental/Groceries/Entertainment/Travel/Others)
- **Notes**: Optional description field
- **Date**: Date picker with default to current date
- **Payment Mode**: Multiple options (UPI/Credit Card/Net Banking/Cash)

### Operations
- ✅ **Add Expenses**: Intuitive form with validation
- ✅ **View Expenses**: Sortable table with pagination
- ✅ **Edit Expenses**: Modal dialog for modifications
- ✅ **Delete Expenses**: One-click removal
- ✅ **Filter & Search**: Advanced filtering by date, category, payment mode

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ with TypeScript
- **UI Library**: ShadCN/UI components
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for analytics visualization
- **HTTP Client**: Axios for API communication

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Express Validator
- **Logging**: Winston
- **Environment**: dotenv for configuration

### DevOps
- **Containerization**: Docker & Docker Compose
- **Development**: Hot reload for both frontend and backend

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Docker and Docker Compose
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/regression1607/Expense-Tracker.git
cd Expense-Tracker
```

### 2. Start MongoDB with Docker
```bash
docker-compose up -d
```

### 3. Setup Backend
```bash
cd backend
npm install
npm run dev
```
Backend will start on http://localhost:8000

### 4. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will start on http://localhost:3000

### 5. Access the Application
Open your browser and navigate to http://localhost:3000

## 📁 Project Structure

```
Expense-Tracker/
├── docker-compose.yml          # MongoDB container configuration
├── .gitignore                  # Git ignore patterns
├── README.md                   # Project documentation
├── backend/                    # Node.js backend
│   ├── package.json
│   ├── server.js              # Entry point
│   ├── .env                   # Environment variables
│   └── src/
│       ├── app.js             # Express app configuration
│       ├── config/
│       │   └── database.js    # MongoDB connection
│       ├── controllers/       # Route handlers
│       ├── middleware/        # Custom middleware
│       ├── models/           # Mongoose schemas
│       ├── routes/           # API routes
│       ├── services/         # Business logic
│       ├── utils/            # Utility functions
│       └── validators/       # Input validation
└── frontend/                 # Next.js frontend
    ├── package.json
    ├── next.config.ts
    ├── tailwind.config.ts
    └── src/
        ├── app/              # Next.js app router
        ├── components/       # React components
        │   ├── expenses/     # Expense-related components
        │   └── ui/          # Reusable UI components
        └── lib/             # Utilities and configurations
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 📝 API Endpoints

### Expenses
- `GET /api/expenses` - Get all expenses with optional filters
- `POST /api/expenses` - Create a new expense
- `GET /api/expenses/:id` - Get expense by ID
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/analytics` - Get expense analytics

### Query Parameters for GET /api/expenses
- `dateFilter`: thisMonth, last30Days, last90Days, allTime
- `categories`: Filter by categories (multiple allowed)
- `paymentModes`: Filter by payment modes (multiple allowed)
- `page`: Page number for pagination
- `limit`: Number of items per page

## 🎯 Features in Detail

### Analytics Dashboard
- **Monthly Spending Trends**: Visual representation of spending over time
- **Category Breakdown**: Pie charts showing expense distribution
- **Payment Mode Analysis**: Insights into preferred payment methods
- **Summary Statistics**: Total expenses, transaction count, average expense

### Filtering & Search
- **Date Range Filters**: This month, last 30/90 days, all time
- **Category Filters**: Multi-select category filtering
- **Payment Mode Filters**: Filter by payment methods
- **Real-time Updates**: Instant filtering without page reload

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Perfect layout for tablets
- **Desktop Experience**: Rich desktop interface with full features

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [ShadCN/UI](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [Recharts](https://recharts.org/) for chart visualizations
- [MongoDB](https://www.mongodb.com/) for the flexible database

## 📞 Support

If you have any questions or need help with setup, please open an issue in the GitHub repository.

---

**Happy Expense Tracking! 💰📊**
