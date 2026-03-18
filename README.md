# ServiGo - Service Booking Platform

A comprehensive full-stack service booking platform that connects customers with service providers. Built with React, Node.js, Express, and MongoDB.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [User Roles & Permissions](#user-roles--permissions)
- [Database Models](#database-models)
- [Frontend Routes](#frontend-routes)
- [Available Scripts](#available-scripts)
- [License](#license)

---

## 📱 Project Overview

ServiGo is a multi-role service booking platform that enables customers to browse and book various services (like AC repair, plumbing, electrical work, etc.), while service providers can manage their assignments. The platform includes an admin dashboard for overall management and a support system for handling customer issues.

### Key Highlights

- 🔐 Secure JWT-based authentication
- 📅 Real-time service booking
- 👥 Multi-role system (Admin, Customer, Technician, Support)
- 🎫 Ticket/Support system
- 📱 Responsive design
- 🌙 Light/Dark theme support

---

## 🛠 Tech Stack

### Frontend
- **React** (19.x) - UI Library
- **React Router** (7.x) - Client-side routing
- **Bootstrap** (5.3.x) - CSS Framework
- **Firebase** - Authentication
- **React Scripts** - Build tooling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** (5.x) - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JSON Web Token (JWT)** - Authentication
- **Bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **Multer** - File uploads

---

## 📂 Project Structure

```
Project_01/
├── backend/                      # Backend server
│   ├── controllers/              # Route controllers
│   │   ├── authController.js
│   │   ├── customerController.js
│   │   └── productController.js
│   ├── middleware/              # Custom middleware
│   │   ├── admin.js            # Admin authorization
│   │   ├── auth.js             # JWT authentication
│   │   ├── staff.js            # Staff authorization
│   │   └── technician.js       # Technician authorization
│   ├── models/                  # Mongoose schemas
│   │   ├── Booking.js         # Booking schema
│   │   ├── customer.js         # User/Customer schema
│   │   ├── Notification.js     # Notification schema
│   │   ├── product.js          # Product schema
│   │   ├── Service.js          # Service schema
│   │   └── Ticket.js           # Support ticket schema
│   ├── routes/                  # API routes
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── productRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── technicianRoutes.js
│   │   └── ticketRoutes.js
│   ├── uploads/                 # Uploaded files
│   ├── utils/                   # Utility functions
│   │   ├── email.js            # Email sending
│   │   └── notify.js           # Notifications
│   ├── index.js                # Server entry point
│   ├── server.js               # Alternative server file
│   └── package.json            # Backend dependencies
│
├── frontend/                    # React frontend
│   ├── public/                 # Static files
│   │   └── index.html
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── AdminSidebar.js
│   │   │   ├── AdminTopbar.js
│   │   │   ├── FixedCallButton.js
│   │   │   ├── Footer.js
│   │   │   ├── Login.js
│   │   │   ├── Navbar.js
│   │   │   ├── PrivateRoute.js
│   │   │   ├── ProductCard.js
│   │   │   ├── Profile.js
│   │   │   ├── Register.js
│   │   │   └── dashboard/       # Dashboard components
│   │   ├── layouts/             # Layout components
│   │   ├── pages/               # Page components
│   │   │   ├── About.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── AdminProducts.js
│   │   │   ├── AdminServices.js
│   │   │   ├── AdminBookings.js
│   │   │   ├── AdminTickets.js
│   │   │   ├── AdminUsers.js
│   │   │   ├── Contact.js
│   │   │   ├── Dashboard.js
│   │   │   ├── FAQ.js
│   │   │   ├── Home.js
│   │   │   ├── PrivacyPolicy.js
│   │   │   ├── RaiseTicket.js
│   │   │   ├── Services.js
│   │   │   ├── TermsOfService.js
│   │   │   ├── TechnicianDashboard.js
│   │   │   └── ...more pages
│   │   ├── services/            # API services
│   │   │   ├── adminApi.js
│   │   │   ├── api.js
│   │   │   └── technicianApi.js
│   │   ├── utils/               # Frontend utilities
│   │   │   └── session.js
│   │   ├── App.js              # Main app component
│   │   ├── firebase.js         # Firebase config
│   │   └── index.js            # Entry point
│   └── package.json            # Frontend dependencies
│
└── README.md                    # This file
```

---

## ✨ Features

### Customer Features
- 🔍 Browse available services
- 📅 Book services with date/time selection
- 📍 Provide address and location details
- 💳 Multiple payment methods (UPI, Card, Cash)
- 📊 View booking history and status
- ⭐ Rate and review completed services
- 🎫 Raise support tickets
- 👤 Manage profile

### Technician Features
- 📋 View assigned bookings
- ✔ Accept/Reject service requests
- 📝 Update booking status
- 👤 Manage technician profile

### Admin Features
- 📊 Dashboard with analytics
- 🛠 Manage services (CRUD)
- 📦 Manage products
- 👥 Manage users (customers, technicians)
- 📅 View and manage all bookings
- 🎫 Handle support tickets
- 📈 View reports and statistics

### Support Staff Features
- 👥 Manage customers
- 📅 View/manage bookings
- 🛠 Manage services
- 👨‍🔧 Manage service providers

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas cloud)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
cd e:/Project_01
```

2. **Install Backend Dependencies**

```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**

```bash
cd frontend
npm install
```

4. **Configure Environment Variables**

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/serviceApp
JWT_SECRET=your_jwt_secret_key_here
```

5. **Run the Backend Server**

```bash
cd backend
npm start
```

The backend will run on `http://localhost:5000`

6. **Run the Frontend Development Server**

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

---

## 📝 Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port number | 5000 |
| MONGO_URI | MongoDB connection string | mongodb://127.0.0.1:27017/serviceApp |
| JWT_SECRET | Secret key for JWT token generation | - |
| EMAIL_USER | Email address for sending notifications | - |
| EMAIL_PASS | Email password/app password | - |

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |

### Customer Routes (`/api`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/customers/register` | Register new customer |
| GET | `/api/customers/profile` | Get customer profile |
| PUT | `/api/customers/profile` | Update customer profile |
| GET | `/api/customers/bookings` | Get customer bookings |

### Service Routes (`/api`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | Get all services |
| POST | `/api/services` | Create service (admin) |
| PUT | `/api/services/:id` | Update service (admin) |
| DELETE | `/api/services/:id` | Delete service (admin) |

### Booking Routes (`/api`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create new booking |
| GET | `/api/bookings` | Get all bookings |
| GET | `/api/bookings/:id` | Get booking by ID |
| PUT | `/api/bookings/:id` | Update booking |
| PUT | `/api/bookings/:id/status` | Update booking status |
| POST | `/api/bookings/:id/review` | Add review/rating |

### Product Routes (`/api/products`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| POST | `/api/products` | Add product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |

### Ticket Routes (`/api`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tickets` | Create support ticket |
| GET | `/api/tickets` | Get user tickets |
| GET | `/api/tickets/:id` | Get ticket by ID |
| PUT | `/api/tickets/:id` | Update ticket |
| PUT | `/api/tickets/:id/assign` | Assign ticket |
| PUT | `/api/tickets/:id/resolve` | Resolve ticket |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| PUT | `/api/admin/users/:id` | Update user |
| DELETE | `/api/admin/users/:id` | Delete user |
| GET | `/api/admin/stats` | Get dashboard statistics |

### Technician Routes (`/api`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/technician/bookings` | Get technician bookings |
| PUT | `/api/technician/bookings/:id/accept` | Accept booking |
| PUT | `/api/technician/bookings/:id/reject` | Reject booking |
| PUT | `/api/technician/bookings/:id/complete` | Complete booking |

### Notification Routes (`/api`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get user notifications |
| PUT | `/api/notifications/:id/read` | Mark as read |

---

## 👥 User Roles & Permissions

| Role | Description | Access Level |
|------|-------------|--------------|
| `customer` | Regular end-user | Book services, view own bookings, raise tickets |
| `technician` | Service provider | View assigned jobs, accept/reject/complete bookings |
| `support` | Customer support staff | Manage customers, bookings, services, providers |
| `admin` | Platform administrator | Full access to all features and settings |

---

## 🗄 Database Models

### Customer
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: Enum ['user', 'customer', 'technician', 'support', 'admin'],
  isBlocked: Boolean,
  isApproved: Boolean,
  technicianProfile: {
    skills: [String],
    city: String,
    experienceYears: Number,
    availability: Object
  }
}
```

### Service
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  etaMinutes: Number,
  isActive: Boolean
}
```

### Booking
```javascript
{
  user: ObjectId (ref: Customer),
  service: ObjectId (ref: Service),
  technician: ObjectId (ref: Customer),
  serviceName: String,
  category: String,
  location: String,
  address: {
    fullName, phone, addressLine1, addressLine2,
    landmark, city, state, pincode, googleMapsLink
  },
  date: String,
  time: String,
  price: Number,
  paymentMethod: Enum ['upi', 'card', 'cash'],
  paymentStatus: Enum ['pending', 'paid', 'failed'],
  status: Enum ['pending', 'assigned', 'completed', 'cancelled'],
  technicianAction: Enum ['none', 'accepted', 'rejected'],
  rating: Number (1-5),
  review: String
}
```

### Ticket
```javascript
{
  title: String,
  description: String,
  category: Enum ['billing', 'technical', 'service', 'feedback', 'complaint', 'other'],
  priority: Enum ['low', 'medium', 'high', 'urgent'],
  status: Enum ['open', 'in_progress', 'resolved', 'closed'],
  createdBy: ObjectId (ref: Customer),
  assignedTo: ObjectId (ref: Customer),
  resolvedBy: ObjectId (ref: Customer),
  resolution: String,
  attachments: [String]
}
```

---

## 🖥 Frontend Routes

| Route | Component | Access |
|-------|-----------|--------|
| `/` | Home | Public |
| `/services` | Services | Public |
| `/about` | About | Public |
| `/faq` | FAQ | Public |
| `/contact` | Contact | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/privacy` | PrivacyPolicy | Public |
| `/terms` | TermsOfService | Public |
| `/refund` | RefundPolicy | Public |
| `/dashboard` | Dashboard | Private (Customer) |
| `/raise-ticket` | RaiseTicket | Private |
| `/my-tickets` | MyTickets | Private |
| `/admin` | AdminDashboard | Private (Admin) |
| `/admin/services` | AdminServices | Private (Admin) |
| `/admin/bookings` | AdminBookings | Private (Admin) |
| `/admin/providers` | AdminProviders | Private (Admin) |
| `/admin/users` | AdminUsers | Private (Admin) |
| `/admin/products` | AdminProducts | Private (Admin) |
| `/admin/tickets` | AdminTickets | Private (Admin) |
| `/technician` | TechnicianDashboard | Private (Technician) |
| `/support` | Support Dashboard | Private (Support) |

---

## 📦 Available Scripts

### Backend

```bash
cd backend
npm start          # Start production server
npm test           # Run tests
```

### Frontend

```bash
cd frontend
npm start          # Start development server
npm build          # Create production build
npm test           # Run tests
npm eject          # Eject from create-react-app
```

---

## 🔧 Additional Configuration

### MongoDB Setup

**Local MongoDB:**
Ensure MongoDB is running locally on port 27017.

**MongoDB Atlas (Cloud):**
1. Create a cluster on MongoDB Atlas
2. Get your connection string
3. Update `MONGO_URI` in `.env`

### Running Both Servers

To run both frontend and backend simultaneously, you can use two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Developer Notes

- The project uses JWT for authentication with role-based access control
- Passwords are hashed using bcryptjs
- File uploads are handled via Multer and stored in `backend/uploads/`
- Email notifications are sent via Nodemailer
- The frontend uses React Context API for state management
- Firebase is used for additional authentication features
- Theme (light/dark) preference is persisted in localStorage

---

## 📞 Support

For any issues or questions, please raise a ticket through the platform or contact the administrator.

