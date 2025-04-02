# Property Management System

A comprehensive property management solution for landlords and tenants.

## Features

- User authentication and authorization with role-based access control (Admin, Landlord, Tenant)
- Property listings with detailed information and search capabilities
- Landlord dashboard for managing properties, tenants, and maintenance requests
- Tenant dashboard for managing leases, payments, and maintenance requests
- Online payment processing
- Maintenance request tracking
- Messaging system for communication between landlords and tenants
- Responsive design that works on mobile, tablet, and desktop

## Technology Stack

- **Frontend**: React, React Router, Axios, React Icons
- **Backend**: Node.js, Express (to be implemented)
- **Database**: MongoDB (to be implemented)
- **Authentication**: JWT (to be implemented)

## Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/property-management-system.git
   ```

2. Navigate to the project directory
   ```bash
   cd property-management-system
   ```

3. Install dependencies
   ```bash
   # For the Frontend
   cd Frontend
   npm install
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
property-management-system/
├── Frontend/               # Frontend React application
│   ├── public/             # Public assets
│   ├── src/                # Source files
│   │   ├── assets/         # Static assets
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main App component
│   │   ├── main.jsx        # Entry point
│   │   └── ...
│   └── ...
├── Backend/                # Backend Node.js application (to be implemented)
└── ...
```

## Test Accounts

For demo purposes, you can use these test accounts:

- **Admin**: admin@example.com / password
- **Landlord**: landlord@example.com / password
- **Tenant**: tenant@example.com / password

## Future Enhancements

- Backend integration with Node.js and Express
- Database integration with MongoDB
- Real-time notifications
- Document signing for leases
- Advanced reporting and analytics
- Mobile app development

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React team for the amazing library
- All open-source contributors whose libraries are used in this project 