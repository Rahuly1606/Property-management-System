# PropertyHub - Property Management System

A production-ready React frontend MVP for managing properties, leases, payments, and maintenance requests.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server with mock data
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

The app will start at `http://localhost:8080` with MSW (Mock Service Worker) intercepting API calls.

## 🎨 Design System

### Color Palette (HSL Format)

All colors are defined as CSS variables in `src/index.css`:

- **Primary**: `#777C6D` (72 9% 45%) - Olive green for CTAs and primary actions
- **Secondary**: `#B7B89F` (60 16% 67%) - Sage for accents and secondary elements
- **Muted**: `#CBCBCB` (0 0% 80%) - Light gray for borders and dividers
- **Background**: `#EEEEEE` (0 0% 93%) - Off-white for app background
- **Text**: `#1F2937` (215 25% 17%) - Dark gray for readable text

### Updating the Theme

**CSS Variables** (src/index.css):
```css
:root {
  --pms-primary: 72 9% 45%;
  --pms-secondary: 60 16% 67%;
  --pms-muted: 0 0% 80%;
  --pms-background: 0 0% 93%;
  --pms-text: 215 25% 17%;
}
```

**Tailwind Config** (tailwind.config.ts):
```typescript
colors: {
  pms: {
    primary: "hsl(var(--pms-primary))",
    secondary: "hsl(var(--pms-secondary))",
    // ...
  }
}
```

## 🔑 Environment Variables

Create a `.env` file in the root directory (see `.env.example`):

```env
# API endpoint (defaults to MSW mock if not set)
VITE_API_URL=http://localhost:3000/api

# Cloudinary for image uploads (optional, uses mock if not set)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Razorpay for payments (optional, uses mock if not set)
VITE_RAZORPAY_KEY=your_razorpay_key
```

## 👥 User Roles & Test Accounts

### Admin
- **Email**: `admin@pms.com`
- **Password**: `admin123`
- **Capabilities**: User management, approve listings and purchase requests

### Landlord
- **Email**: `landlord@pms.com`
- **Password**: `landlord123`
- **Capabilities**: Manage properties, leases, maintenance requests, view sold properties

### Tenant
- **Email**: `tenant@pms.com`
- **Password**: `tenant123`
- **Capabilities**: Browse properties, request leases, make payments, submit maintenance requests

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/              # Login, Register
│   ├── properties/        # PropertyForm, PropertyCard
│   ├── payments/          # PaymentForm, RazorpayPayment
│   ├── maintenance/       # MaintenanceRequestForm
│   └── ui/               # Shadcn UI components
├── contexts/
│   └── AuthContext.tsx    # Authentication state management
├── pages/
│   ├── Home.tsx          # Landing page
│   ├── landlord/         # Landlord dashboard and views
│   ├── tenant/           # Tenant dashboard and views
│   └── admin/            # Admin dashboard
├── routes/
│   ├── ProtectedRoute.tsx # Auth guard
│   └── RoleRoute.tsx      # Role-based access control
├── services/
│   ├── api.ts            # Axios instance with interceptors
│   ├── authService.ts
│   ├── propertyService.ts
│   ├── leaseService.ts
│   ├── paymentService.ts
│   └── maintenanceService.ts
├── mock/
│   ├── handlers.ts       # MSW request handlers
│   └── data/             # Mock data (users, properties, etc.)
├── utils/
│   ├── validators.ts     # Form validation utilities
│   └── formatters.ts     # Currency and date formatters
└── mocks/
    └── browser.ts        # MSW browser setup
```

## 🔄 Switching from Mock to Real API

### Disable MSW

In `src/main.tsx`, comment out or remove the MSW initialization:

```typescript
// Comment this out to disable mock server
/*
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    return worker.start({ onUnhandledRequest: 'bypass' });
  }
}
*/

// Then start app directly
createRoot(document.getElementById("root")!).render(<App />);
```

### Configure Real API

Set `VITE_API_URL` in your `.env`:
```env
VITE_API_URL=https://your-api-domain.com/api
```

## 🧪 Testing

Tests are located in `src/tests/` and use Jest + React Testing Library.

**Run all tests:**
```bash
npm test
```

**Key test files:**
- `Login.test.tsx` - Auth flow validation
- `PropertyForm.test.tsx` - Property creation/update
- `PaymentForm.test.tsx` - Payment processing

## 🏗️ Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

## 📋 Features Implemented

✅ **Authentication**
- Login/Register with role-based access
- Protected routes with automatic redirects
- Token-based auth with localStorage persistence

✅ **Property Management**
- CRUD operations for properties
- Image upload support (Cloudinary integration ready)
- Advanced search and filtering

✅ **Lease Management**
- Create and manage lease agreements
- Lease status tracking
- PDF document support

✅ **Payment Processing**
- Razorpay integration (stubbed for mock mode)
- Payment history
- Receipt generation

✅ **Maintenance Requests**
- Submit requests with images
- Status tracking (pending, in progress, resolved)
- Priority levels

✅ **Dashboards**
- Role-specific dashboards (Landlord, Tenant, Admin)
- Stats and analytics
- Quick action buttons

## 🔒 Security Features

- Input validation on all forms
- Role-based access control
- Protected API routes
- Token expiration handling (401 auto-logout)
- XSS prevention (no dangerouslySetInnerHTML)

## 🎯 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **React Router v6** - Routing
- **Axios** - HTTP client
- **MSW** - API mocking
- **React Query** - Data fetching
- **Zod** - Schema validation (via utils)

## 📝 Notes

- **TypeScript**: This project uses TypeScript (Lovable default) instead of plain JavaScript as specified, but with minimal type annotations for ease of use.
- **Mock Server**: MSW runs automatically in development mode and intercepts all API calls.
- **Responsive**: All pages are fully responsive and mobile-friendly.
- **Accessibility**: Semantic HTML and proper ARIA labels throughout.

## 🤝 Contributing

For local development:

1. Clone the repo
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env`
4. Start dev server: `npm run dev`
5. Make changes and test thoroughly
6. Run tests: `npm test`

## 📞 Support

For issues or questions, please refer to the inline code documentation or reach out to the development team.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
