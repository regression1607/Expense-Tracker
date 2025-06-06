# 🚀 Deployment Guide

This guide will help you deploy the Expense Tracker application in different environments.

## 📋 Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- Git

## 🏠 Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/regression1607/Expense-Tracker.git
cd Expense-Tracker
```

### 2. Environment Configuration

#### Backend Environment
```bash
cd backend
cp .env.example .env
```
Edit `.env` file with your configuration:
```env
PORT=8000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/expense-tracker
```

#### Frontend Environment
```bash
cd frontend
cp .env.example .env.local
```
Edit `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Start Services

#### Option A: Using Docker Compose (Recommended)
```bash
# Start MongoDB
docker-compose up -d

# Install and start backend
cd backend
npm install
npm run dev

# Install and start frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

#### Option B: Manual Setup
```bash
# Start MongoDB manually (if you have it installed locally)
mongod --dbpath /path/to/your/data/directory

# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- MongoDB: mongodb://localhost:27017

## 🌐 Production Deployment

### Environment Variables for Production

#### Backend (.env)
```env
PORT=8000
NODE_ENV=production
MONGODB_URI=mongodb://your-mongo-host:27017/expense-tracker
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

### Deployment Options

#### 1. Vercel (Frontend) + Railway/Heroku (Backend)

**Frontend on Vercel:**
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

**Backend on Railway:**
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Railway will auto-detect the backend folder

#### 2. Docker Deployment

**Build Docker Images:**
```bash
# Backend Dockerfile (create in backend/)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8000
CMD ["npm", "start"]

# Frontend Dockerfile (create in frontend/)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

**Docker Compose for Production:**
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:7
    container_name: expense-tracker-mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      MONGO_INITDB_DATABASE: expense-tracker

  backend:
    build: ./backend
    container_name: expense-tracker-backend
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/expense-tracker
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    container_name: expense-tracker-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000/api
    depends_on:
      - backend

volumes:
  mongo-data:
```

#### 3. Cloud Deployment (AWS/GCP/Azure)

**MongoDB Atlas Setup:**
1. Create a MongoDB Atlas cluster
2. Get connection string
3. Update MONGODB_URI in backend environment

**Backend Deployment:**
- AWS: Use Elastic Beanstalk or EC2
- GCP: Use App Engine or Compute Engine
- Azure: Use App Service

**Frontend Deployment:**
- AWS: Use Amplify or S3 + CloudFront
- GCP: Use Firebase Hosting or Cloud Storage
- Azure: Use Static Web Apps

## 🔧 Configuration

### Backend Configuration

**package.json scripts:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

### Frontend Configuration

**package.json scripts:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

## 📊 Monitoring and Logs

### Backend Logs
Logs are stored in `backend/logs/`:
- `combined.log` - All logs
- `error.log` - Error logs only

### Production Monitoring
Consider adding:
- Application monitoring (New Relic, Datadog)
- Error tracking (Sentry)
- Log aggregation (ELK Stack, CloudWatch)

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files
- Use secure connection strings
- Rotate secrets regularly

### Production Checklist
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation active
- [ ] Error messages sanitized
- [ ] Database connection secured

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing
Use the provided API endpoints for testing:
- GET /api/expenses
- POST /api/expenses
- PUT /api/expenses/:id
- DELETE /api/expenses/:id
- GET /api/expenses/analytics

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in environment variables
2. **MongoDB connection**: Check connection string and network access
3. **CORS errors**: Verify frontend URL in backend CORS configuration
4. **Build failures**: Check Node.js version compatibility

### Debug Commands
```bash
# Check if services are running
netstat -tulpn | grep :3000
netstat -tulpn | grep :8000

# Check MongoDB connection
mongo --eval "db.adminCommand('ismaster')"

# View logs
tail -f backend/logs/combined.log
```

## 📞 Support

If you encounter issues during deployment:
1. Check the logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check network connectivity between services

For additional help, create an issue in the GitHub repository.
