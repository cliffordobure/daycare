# Nurtura - Daycare Management SaaS Platform

A comprehensive, multi-tenant SaaS platform for daycare centers to manage their operations, staff, children, and parent communications efficiently.

## 🚀 Features

### Multi-Tenant Architecture
- **Center Registration**: Daycare centers can sign up and create their own ecosystem
- **Role-Based Access Control**: Admin, Teacher, and Parent roles with specific permissions
- **Data Isolation**: Each center's data is completely separated and secure
- **Subscription Management**: Built-in subscription plans and user limits

### Core Functionality
- **Child Management**: Comprehensive child profiles, attendance tracking, and developmental milestones
- **Staff Management**: Teacher and admin user management with role-based permissions
- **Parent Portal**: Real-time updates, communication, and payment management
- **Attendance Tracking**: Daily attendance with real-time updates
- **Activity Management**: Curriculum planning and activity tracking
- **Health Records**: Medical information and health monitoring
- **Communication Hub**: Seamless messaging between all stakeholders
- **Reporting & Analytics**: Comprehensive insights and performance metrics

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
- **Multi-tenant data model** with center-based isolation
- **JWT authentication** with role-based permissions
- **RESTful API** with comprehensive validation
- **MongoDB** with optimized indexes for multi-tenancy
- **Socket.IO** for real-time communication

### Frontend (React + Redux + Tailwind CSS)
- **Modern React** with hooks and functional components
- **Redux Toolkit** for state management with persistence
- **Responsive design** with Tailwind CSS
- **Role-based routing** and protected components
- **Real-time updates** via WebSocket connections

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
git clone <repository-url>
cd nurtura
   ```

2. **Install dependencies**
   ```bash
# Backend
   cd backend
   npm install

# Frontend
   cd ../frontend
   npm install
   ```

3. **Environment Configuration**
Create a `.env` file in the backend directory:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/nurtura
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nurtura

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

4. **Start the application**
   ```bash
# Backend (from backend directory)
   npm run dev

# Frontend (from frontend directory)
   npm run dev
   ```

## 📱 Usage

### For Daycare Centers

1. **Register Your Center**
   - Visit `/center-registration`
   - Fill in center details and admin information
   - Complete the 4-step registration process

2. **Admin Dashboard**
   - Manage center settings and information
   - Create and manage user accounts (teachers, parents)
   - Monitor center performance and analytics

3. **User Management**
   - Create teacher accounts with specific permissions
   - Add parent accounts and link children
   - Manage user roles and access levels

### For Teachers

1. **Login with your credentials**
2. **Access your assigned classes and children**
3. **Track attendance and activities**
4. **Communicate with parents**
5. **Update health records and reports**

### For Parents

1. **Login with your credentials**
2. **View your children's information**
3. **Track attendance and activities**
4. **Receive real-time updates**
5. **Manage payments and communications**

## 🔐 Security Features

- **JWT-based authentication** with secure token management
- **Role-based access control** with granular permissions
- **Data isolation** between centers
- **Input validation** and sanitization
- **Rate limiting** and security headers
- **Password policies** and secure storage

## 📊 Database Schema

### Multi-Tenant Design
- **Center**: Main entity with subscription and settings
- **User**: Role-based users linked to centers
- **Child**: Children linked to parents and centers
- **Class**: Class management with teacher assignments
- **Attendance**: Daily attendance tracking
- **Activity**: Curriculum and activity management

### Key Relationships
```
Center (1) ←→ (Many) Users
User (1) ←→ (Many) Children (if parent)
User (1) ←→ (Many) Classes (if teacher)
Center (1) ←→ (Many) Classes
Center (1) ←→ (Many) Children
```

## 🚀 Deployment

### Backend Deployment
1. Set environment variables for production
2. Use PM2 or similar process manager
3. Configure MongoDB Atlas for production
4. Set up proper SSL certificates

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Configure environment variables
4. Set up custom domain

## 🔧 Development

### Project Structure
```
nurtura/
├── backend/                 # Node.js backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── server.js          # Main server file
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store and slices
│   │   └── utils/         # Utility functions
│   └── package.json
└── README.md
```

### Available Scripts

**Backend:**
- `npm run dev`: Start development server with nodemon
- `npm start`: Start production server
- `npm test`: Run tests

**Frontend:**
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Roadmap

- [ ] Mobile applications (iOS/Android)
- [ ] Advanced analytics and reporting
- [ ] Integration with payment gateways
- [ ] Multi-language support
- [ ] Advanced notification system
- [ ] API for third-party integrations
- [ ] Advanced security features
- [ ] Performance monitoring and optimization

---

**Built with ❤️ for better childcare management**
