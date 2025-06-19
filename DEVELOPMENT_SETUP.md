# Development Setup Guide

This guide helps you set up the Efficiency Tracker for local development.

## 🚀 Quick Start

### 1. Backend API Setup

1. **Navigate to the API directory:**
   ```bash
   cd ept-api
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up local environment:**
   ```bash
   # Copy the development environment file
   cp .env.development .env
   ```

4. **Run the API server:**
   ```bash
   python main.py
   ```
   
   The API will be available at `http://localhost:8080`

### 2. Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd ept-app
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Create local environment file:**
   ```bash
   # Create .env.local file for local development
   echo "VITE_API_BASE_URL=http://localhost:8080" > .env.local
   echo "VITE_APP_ENV=development" >> .env.local
   echo "VITE_DEBUG=true" >> .env.local
   echo "VITE_MOCK_MODE=false" >> .env.local
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   
   The frontend will be available at `http://localhost:5173`

## 🔧 CORS Configuration

The CORS issue has been fixed with the following updates:

### Backend CORS Settings (`ept-api/main.py`)
- ✅ Added support for common development ports (5173, 5174, 3000, 8080)
- ✅ Added the production AppRunner URL
- ✅ Proper preflight request handling
- ✅ Environment-based CORS origin configuration

### Frontend Environment Configuration
- ✅ `.env` - Production configuration (uses AppRunner URL)
- ✅ `.env.local` - Local development (uses localhost:8080)
- ✅ `.env.production` - Production build configuration

## 🌐 Environment URLs

| Environment | Frontend URL | Backend URL |
|-------------|--------------|-------------|
| Local Dev | http://localhost:5173 | http://localhost:8080 |
| Production | https://vecgen.github.io/ept-app | https://mnwpivaen5.us-east-1.awsapprunner.com |

## 🛠️ Troubleshooting CORS

If you're still experiencing CORS issues:

1. **Make sure both servers are running:**
   - Backend: `http://localhost:8080`
   - Frontend: `http://localhost:5173`

2. **Check your `.env.local` file contains:**
   ```
   VITE_API_BASE_URL=http://localhost:8080
   ```

3. **Clear browser cache and restart both servers**

4. **Check browser console for specific CORS error messages**

## 📋 API Endpoints

The following endpoints are now available and working:

- **Authentication:** `/api/auth/admin/login`, `/api/auth/engineer/login`
- **Teams:** `/api/teams` (GET, POST, DELETE)
- **Admin:** `/api/admin/dashboard`, `/api/admin/settings`
- **Engineer:** `/api/engineer/dashboard`, `/api/engineer/entry`
- **Analytics:** `/api/data/analytics/team/{team_name}`, `/api/data/analytics/overall`
- **Data Export:** `/api/data/export/team/{team_name}`

## 🔐 Authentication

- **Admin Password:** Set via environment variable or use default for development
- **Engineer Access:** Login with team name and developer name
- **JWT Tokens:** Automatically handled by the frontend

## 📊 Data Storage

- **Development:** Uses local file storage (no S3 required)
- **Production:** Uses AWS S3 for data persistence

## 🚨 Common Issues

1. **Port 5173 already in use:** Vite will automatically try port 5174
2. **Backend not starting:** Check Python dependencies and port 8080 availability
3. **API calls failing:** Verify the backend is running and CORS is configured
4. **Authentication errors:** Check JWT token handling and storage

---

**Note:** The `.env.local` file is ignored by Git for security reasons. Each developer needs to create their own local environment file. 