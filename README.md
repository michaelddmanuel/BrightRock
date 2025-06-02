# Sasol Training Attendance & Compliance Solution

This application automates training attendance, declaration form management, and compliance reporting for Sasol's Enterprise and Supplier Development (ESD) programs.

## Features

- **Attendance Tracking & Declaration Forms Management**
- **Training Calendar & Reminders**
- **Vendor & ESD Training Monitoring**
- **Reporting & Compliance Insights**
- **Integration & Scalability**

## Tech Stack

### Frontend
- React with TypeScript
- Chakra UI (customized with Sasol branding)
- React Router for navigation
- Context API for state management

### Backend
- Node.js with Express
- PostgreSQL database
- Sequelize ORM
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```
4. Set up environment variables (see `.env.example` files in both directories)
5. Start the backend server:
   ```
   cd backend
   npm run dev
   ```
6. Start the frontend development server:
   ```
   cd frontend
   npm start
   ```

## Docker Deployment

The application can be easily deployed using Docker:

1. Copy the `.env.example` file to `.env` and update with your configuration:
   ```
   cp .env.example .env
   ```

2. Build and start the containers:
   ```
   docker-compose up -d
   ```

3. Seed the database with initial data:
   ```
   docker-compose exec backend npm run seed
   ```

4. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:5000

## Development Setup

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`

4. Run database migrations:
   ```
   npm run migrate
   ```

5. Seed the database:
   ```
   npm run seed
   ```

6. Start the development server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Project Structure

The application follows a modular and scalable architecture for better organization and maintainability.

### Frontend Structure

```
frontend/
├── public/                  # Public assets and index.html
├── src/
│   ├── assets/              # Static assets like images, icons, etc.
│   ├── components/          # Reusable UI components
│   │   ├── admin/           # Admin-specific components
│   │   ├── charts/          # Chart and visualization components 
│   │   ├── common/          # Common components used across the app
│   │   ├── forms/           # Form-related components
│   │   ├── layouts/         # Layout components
│   │   ├── modals/          # Modal components
│   │   └── tables/          # Table components
│   ├── contexts/            # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Application pages 
│   │   ├── admin/           # Admin pages
│   │   ├── auth/            # Authentication pages
│   │   └── user/            # Regular user pages
│   ├── services/            # API services 
│   ├── theme/               # Chakra UI theme configuration
│   └── utils/               # Utility functions
├── App.js                   # Main App component with routing
└── index.js                 # Application entry point
```

### Backend Structure

```
backend/
├── config/                  # Configuration files
├── controllers/             # Request handlers
├── middleware/              # Express middleware
├── models/                  # Database models
├── routes/                  # API routes
├── services/                # Business logic
├── utils/                   # Utility functions
└── index.js                 # Server entry point
```

## License

This project is proprietary and confidential to Sasol.
