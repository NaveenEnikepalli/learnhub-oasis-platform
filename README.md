
# 🎓 LearnHub - Complete MERN Stack Learning Management System

A full-featured Learning Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring role-based authentication, course management, and real-time progress tracking.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm package manager

### Installation & Setup

1. **Clone and setup the project**
   ```bash
   # Run the setup script to install all dependencies
   node setup.js
   ```

2. **Start the application**
   ```bash
   # Start both backend and frontend simultaneously
   node start.js
   ```

   **Or start services separately:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend  
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🛠️ Tech Stack

### Frontend
- **React.js 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for component library
- **React Router** for navigation
- **React Query** for state management and API calls

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **express-validator** for input validation

## 🔐 Default Configuration

The application comes pre-configured with:

- **MongoDB URI**: Connected to Atlas cluster
- **JWT Secret**: Development secret (change for production)
- **File Uploads**: Local storage in `backend/uploads/`
- **CORS**: Enabled for localhost:5173

## 👥 User Roles & Features

### 🎓 Student
- Browse and search courses
- Enroll in published courses
- Track learning progress
- View profile with enrollment history

### 👨‍🏫 Teacher
- Create and manage courses
- Upload course materials (videos, PDFs, assignments)
- Publish/unpublish courses
- View student enrollments and progress

### 🛡️ Admin
- Full access to all features
- User management
- Course moderation
- Platform analytics

## 🏗️ Project Structure

```
learnhub/
├── backend/                    # Node.js/Express backend
│   ├── models/                # Mongoose models
│   ├── routes/               # API routes
│   ├── middleware/          # Custom middleware
│   ├── uploads/            # File upload directory
│   └── server.js          # Main server file
├── src/                     # React frontend
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API service functions
│   └── contexts/          # React contexts
├── start.js               # Development startup script
├── setup.js              # Project setup script
└── README.md             # This file
```

## 🔧 Development

### API Endpoints

**Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

**Courses**
- `GET /api/courses` - Get all courses (with search/filters)
- `POST /api/courses` - Create new course (teachers only)
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

**Users & Profiles**
- `GET /api/users/profile` - Get user profile with role-specific data
- `PUT /api/users/profile` - Update user profile

### Database Models

- **User**: Authentication, profile, and role management
- **Course**: Course content, metadata, and materials
- **Enrollment**: Student-course relationships and progress tracking

## 🚀 Production Deployment

### Backend Deployment
1. Set environment variables:
   ```env
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_secure_jwt_secret
   NODE_ENV=production
   PORT=5000
   ```

2. Build and deploy to your hosting platform

### Frontend Deployment
1. Update API base URL in `src/services/authService.ts`
2. Build: `npm run build`
3. Deploy the `dist` folder

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill processes on ports 5000 and 5173
   npx kill-port 5000
   npx kill-port 5173
   ```

2. **MongoDB connection issues**
   - Check your internet connection
   - Verify MongoDB Atlas cluster is running
   - Ensure IP address is whitelisted in Atlas

3. **File upload issues**
   - Ensure `backend/uploads/` directory exists
   - Check file permissions
   - Verify file size limits

### Development Tips

- Check browser console for frontend errors
- Monitor backend console for API errors
- Use MongoDB Compass to inspect database
- Test API endpoints with Postman/Insomnia

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ using the MERN Stack**
