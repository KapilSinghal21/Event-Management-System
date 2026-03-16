# EventManager – Modern Event Management Platform

## Overview
EventManager is a comprehensive event management platform that combines modern design with powerful functionality. It provides an intuitive interface for discovering, managing, and participating in events, with features like real-time updates, smart recommendations, and seamless registration process.

## Tech Stack
### Frontend
- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS with custom animations
- **State Management**: React Context API
- **UI/UX**: 
  - Framer Motion for animations
  - Dark mode with system preference detection
  - Responsive design with mobile-first approach
  - Modern card layouts with hover effects
- **Data Fetching**: Axios with interceptors
- **Real-time**: Socket.IO client integration

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with role-based access
- **Real-time**: Socket.IO for live updates
- **File Handling**: Custom upload middleware
- **Security**: CORS, rate limiting, input validation

### Development Tools
- **Code Quality**: ESLint, Prettier
- **Build Tools**: Vite, PostCSS
- **Development**: Nodemon for hot-reload
- **Documentation**: Comprehensive JSDoc comments

## Project Structure
```
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helpers & utilities
│   └── uploads/            # Event media storage
└── frontend/
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── context/        # React context providers
    │   ├── hooks/          # Custom React hooks
    │   ├── pages/          # Route components
    │   └── utils/          # Helper functions
    └── public/             # Static assets
```

## Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB 4.4+ running locally or a connection string
- Git for version control
- A modern web browser

### Installation Steps

1. **Clone the Repository**
```bash
git clone <your-repo-url>
cd Event-management-system
```

2. **Install Dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Configure Environment**

Create `backend/.env` file:
```env
# Server Configuration
PORT=5050
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/eventmanager

# Security
JWT_SECRET=your_secure_secret_key
JWT_EXPIRES_IN=7d

# CORS
CLIENT_ORIGIN=http://localhost:5173

# Optional: Email configuration
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

4. **Start Development Servers**

Terminal A (Backend):
```bash
cd backend
npm run dev
```

Terminal B (Frontend):
```bash
cd frontend
npm run dev
```

5. **Seed Sample Data (Optional)**
```bash
cd backend
node src/seed.js
```

### Demo Accounts

#### Customer Account
- Email: customer@example.com
- Password: password
- Features: Browse events, register, review, download tickets

#### Organizer Account
- Email: organizer@example.com
- Password: password
- Features: Create/manage events, view participants, export data

#### Admin Account
- Email: admin@example.com
- Password: password
- Features: Full system access, moderation, user management

## Key Features

### For Event Attendees
- **Enhanced Event Discovery**:
  - Modern card-based event browsing
  - Smart category filtering
  - Real-time search functionality
  - Personalized event recommendations
- **Seamless Registration**:
  - One-click event registration
  - Automatic email confirmations
  - Digital ticket generation with QR codes
  - Add to calendar integration
- **Interactive Experience**:
  - Star ratings and reviews system
  - Event sharing capabilities
  - Real-time announcements
  - Offline-ready passes

### For Event Organizers
- **Event Management**:
  - Intuitive event creation interface
  - Real-time participant tracking
  - Customizable event categories
  - Media upload capabilities
- **Analytics & Insights**:
  - Detailed event statistics
  - Participant demographics
  - Registration trends
  - Review analytics
- **Tools & Utilities**:
  - CSV export functionality
  - Real-time check-in system
  - Bulk participant management
  - Custom event branding

### Platform Features
- **Modern UI/UX**:
  - Responsive design for all devices
  - Dark mode with system preference sync
  - Smooth animations and transitions
  - Toast notifications for updates
- **Performance**:
  - Optimized image loading
  - Efficient data caching
  - Lazy-loaded components
  - Fast search indexing
- **Security**:
  - JWT authentication
  - Role-based access control
  - Secure file uploads
  - Input validation

### Administrative Features
- **Content Moderation**:
  - Event approval workflow
  - Review moderation
  - User management
  - Content filtering
- **System Management**:
  - Category management
  - User role administration
  - System statistics
  - Activity logging

## Development

### Available Scripts

#### Backend Scripts (`backend/`)
```bash
npm run dev      # Start development server with hot-reload
npm run start    # Start production server
npm run test     # Run test suite
npm run lint     # Run ESLint checks
npm run seed     # Seed database with sample data
```

#### Frontend Scripts (`frontend/`)
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint checks
npm run format   # Format code with Prettier
```

### Development Guidelines

1. **Code Style**
   - Follow ESLint configuration
   - Use Prettier for formatting
   - Maintain consistent naming conventions

2. **Git Workflow**
   - Create feature branches
   - Write descriptive commit messages
   - Submit PRs for review

3. **Testing**
   - Write unit tests for new features
   - Test across different browsers
   - Verify dark mode compatibility

## Deployment

### Production Setup

1. **Backend Deployment**
   - Set production environment variables
   - Configure MongoDB connection
   - Set up proper CORS settings
   - Enable security middleware

2. **Frontend Deployment**
   - Build the frontend application
   - Configure CDN for static assets
   - Set up environment variables
   - Enable PWA features

### Environment Variables

```env
# Required Variables
PORT=5050
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
CLIENT_ORIGIN=your_frontend_url

# Optional Variables
NODE_ENV=production
SMTP_CONFIG=your_smtp_settings
STORAGE_CONFIG=your_storage_settings
```

### Production Checklist

- [ ] Set secure environment variables
- [ ] Configure proper CORS settings
- [ ] Set up MongoDB indexes
- [ ] Enable security headers
- [ ] Configure rate limiting
- [ ] Set up monitoring
- [ ] Configure backup system
- [ ] Set up CI/CD pipeline

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.


