# 🌴 AI-Powered Travel Planner

A comprehensive MERN stack application that leverages Google's Llama 3.1 8B (via Groq) to generate highly personalized travel itineraries based on destination, duration, budget, and user preferences.

## 🚀 Key Features

- **AI Itinerary Generation**: Dynamically creates day-by-day plans including activities, locations, and real-time cost estimations.
- **Smart Data Sanitization**: Robust backend logic handles complex AI responses, ensuring structured data storage and precise numeric cost parsing.
- **Admin Dashboard**: Comprehensive stats including total users, trip counting, revenue tracking, and AI token usage/cost metrics.
- **Booking System**: Interactive activity booking directly from the generated itineraries.
- **Responsive Design**: Premium UI built with React and Tailwind CSS, featuring modern aesthetics and smooth transitions.

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Node.js, Express, MongoDB/Mongoose.
- **AI Integration**: Groq API (Llama-3.1-8b-instant).
- **Authentication**: JWT-based secure auth with Admin/User roles.

---

## 🧪 API Testing Results (Success Rate: 100%)

The backend API has been thoroughly tested for reliability and correctness. Below are the results from the latest automated test suite:

### **Authentication**
- `✅ POST /api/auth/register`: Successfully registered new test accounts.
- `✅ POST /api/auth/login`: Verified token generation for both Admin and standard Users.
- `✅ GET /api/auth/me`: Authorized retrieval of profile data.

### **Destinations & Admin Management**
- `✅ GET /api/destinations`: Publicly accessible destination retrieval.
- `✅ POST /api/destinations`: **Admin Only** destination creation passed validation.
- `✅ GET /api/admin/analytics`: **Admin Only** dashboard analytics verified.

### **Itineraries & Bookings**
- `✅ POST /api/itineraries/generate-ai`: Successfully generated structured JSON itineraries from AI prompt.
- `✅ GET /api/itineraries`: Verified user-specific trip retrieval.
- `✅ POST /api/bookings`: Successfully confirmed activity bookings with accurate price parsing.
- `✅ GET /api/bookings/all`: **Admin Only** global booking visibility verified.

---

## 📦 Installation & Setup

1. **Clone the repository**
2. **Backend Setup**:
   - Navigate to `/backend`
   - Run `npm install`
   - Configure `.env` with your `MONGO_URI`, `JWT_SECRET`, and `GROK_API_KEY`.
   - Start the server: `npm start`
3. **Frontend Setup**:
   - Navigate to `/frontend`
   - Run `npm install`
   - Start the development server: `npm run dev`

---

## 🛡️ Admin Credentials (Default)
- **Email**: `admin@gmail.com`
- **Password**: `admin123`

---


