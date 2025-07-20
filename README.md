# Car Wash Management System

A comprehensive car wash management application built with Angular 16, featuring role-based dashboards for users, administrators, and washers.

## Overview

This application provides a complete solution for managing car wash operations with three distinct user roles:

- **Users**: Can browse services, place orders, and manage their bookings
- **Administrators**: Have full system access with analytics and user management capabilities
- **Washers**: Can view and manage assigned wash orders with real-time status updates

## Features

### User Dashboard
- Service catalog with detailed car wash packages
- Shopping cart functionality with order customization
- Order history and status tracking
- Profile management and preferences
- Real-time order updates and notifications

### Admin Dashboard
- Comprehensive analytics and reporting
- User management and role assignment
- Service and pricing management
- Order oversight and system monitoring
- Revenue tracking and business insights

### Washer Dashboard
- Assigned order queue with priority sorting
- Real-time order status updates
- Order acceptance and completion workflow
- Customer communication tools
- Work schedule and availability management

## Technical Stack

- **Frontend**: Angular 16 with TypeScript
- **Styling**: SCSS with modern CSS features
- **UI Components**: Custom components with responsive design
- **State Management**: RxJS for reactive programming
- **Authentication**: JWT-based authentication system
- **API Integration**: RESTful API communication

## Installation

1. Clone the repository:
```bash
git clone https://github.com/tranquility404/car-wash.git
cd car-wash
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Navigate to `http://localhost:4200/` in your browser

## Development Commands

### Development Server
Run `ng serve` for a dev server. The application will automatically reload when source files change.

### Code Generation
Use Angular CLI to generate new components:
```bash
ng generate component component-name
ng generate service service-name
ng generate guard guard-name
```

### Building the Application
Run `ng build` to build the project. Build artifacts will be stored in the `dist/` directory.

### Running Tests
- **Unit Tests**: `ng test` - Executes unit tests via Karma
- **Linting**: `ng lint` - Runs code quality checks
- **Build Verification**: `ng build --prod` - Creates production build

## Project Structure

```
src/
├── app/
│   ├── auth/                 # Authentication services
│   ├── components/           # Reusable UI components
│   │   ├── admin-dashboard/  # Administrator interface
│   │   ├── user-dashboard/   # User interface
│   │   └── washer-dashboard/ # Washer interface
│   ├── guards/               # Route guards for security
│   ├── models/               # TypeScript interfaces
│   ├── services/             # Business logic services
│   └── shared/               # Shared utilities
├── assets/                   # Static resources
└── environments/             # Environment configurations
```

## Video Demonstrations

### User Dashboard Demo
This demonstration showcases the complete user experience including:
- Service browsing and selection
- Shopping cart management
- Order placement process
- Order tracking and history
- Profile management features

*Video placeholder: Insert user dashboard demonstration video here*

### Admin Dashboard Demo
Comprehensive overview of administrative capabilities:
- System analytics and reporting
- User and role management
- Service configuration
- Order monitoring and oversight
- Business intelligence features

*Video placeholder: Insert admin dashboard demonstration video here*

### Washer Dashboard Demo
Complete walkthrough of washer operations:
- Order queue management
- Status update workflows
- Customer communication tools
- Schedule management
- Performance tracking

*Video placeholder: Insert washer dashboard demonstration video here*

## API Integration

The application integrates with a RESTful API providing:
- User authentication and authorization
- Order management endpoints
- Real-time status updates
- Payment processing integration
- Notification services

## Security Features

- JWT-based authentication
- Role-based access control
- Route guards for protected areas
- Input validation and sanitization
- Secure API communication

## Performance Optimizations

- Lazy loading for route modules
- OnPush change detection strategy
- Optimized bundle sizes
- Efficient state management
- Responsive image loading

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For technical support or questions, please contact the development team or create an issue in the repository.
