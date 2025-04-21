# E-Commerce Application with Node.js, Sequelize, TypeScript and React

## Overview

This project is a full-stack e-commerce application featuring:
- **Backend**: Node.js with TypeScript, Sequelize ORM, and RESTful API endpoints
- **Frontend**: React with TypeScript, Material UI for responsive design
- **Architecture**: MVC pattern in the backend, component-based architecture in the frontend

The application provides a comprehensive shopping experience with product browsing, cart management, and order processing functionality.

## Project Structure

```
myapp/
├── backend/                # Node.js backend with TypeScript
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controller/     # HTTP request handlers
│   │   ├── models/         # Database models
│   │   ├── repository/     # Data access layer
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic layer
│   │   └── app.ts          # Main application entry point
│   ├── migrations/         # Database migration files
│   ├── seeders/            # Database seed data
│   └── package.json        # Backend dependencies
│
└── frontend/               # React frontend with TypeScript
    ├── public/             # Static assets
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── contexts/       # React Context providers
    │   ├── pages/          # Page components
    │   ├── services/       # API service integrations
    │   ├── utils/          # Utility functions and helpers
    │   └── App.tsx         # Main React component
    └── package.json        # Frontend dependencies
```

## Features

### Backend
- **RESTful API**: Complete CRUD operations for products, orders, customers, etc.
- **Data Validation**: Input validation to ensure data integrity
- **Advanced Queries**: Support for complex data queries and reporting
- **Product Stock Management**: Real-time inventory tracking and updates
- **Order Processing**: Complete order lifecycle management
- **Multi-table Relationships**: Complex relationships between products, orders, customers

### Frontend
- **Responsive Design**: Optimized for mobile and desktop
- **Material UI**: Modern UI components and styling
- **Shopping Cart**: Real-time cart management with quantity controls
- **Checkout Flow**: Streamlined ordering process
- **Product Search**: Filtering and searching capabilities
- **Stock Validation**: Prevents ordering more products than available
- **Context API**: State management for cart and user sessions

## Prerequisites

- **Node.js**: >= 14.x
- **npm**: >= 6.x
- **MySQL**: >= 5.7

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd myapp
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file with the following content:
# DB_USERNAME=<database_username>
# DB_PASSWORD=<database_password>
# DB_DATABASE=<database_name>
# DB_HOST=127.0.0.1
# DB_DIALECT=mysql
# PORT=8080

# Run database migrations
npx sequelize-cli db:migrate

# Seed the database with sample data
npx sequelize-cli db:seed:all

# Start the backend server
npm run dev
```

The backend will be running at http://localhost:8080

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file with the following content:
# PORT=3030
# REACT_APP_API_URL=http://localhost:8080

# Start the frontend development server
npm start
```

The frontend will be running at http://localhost:3030

## API Endpoints

### Products
- **GET /products**: List all products
- **GET /products/search**: Search products with pagination
- **GET /products/:id**: Get product by ID
- **POST /products**: Create new product
- **PUT /products/:id**: Update product
- **DELETE /products/:id**: Delete product
- **GET /products/top-by-quarter**: Get top products by quarter
- **GET /products/never-ordered**: Get products never ordered

### Orders
- **GET /orders**: List all orders
- **GET /orders/:id**: Get order by ID
- **POST /orders**: Create new order
- **DELETE /orders/:id**: Delete order
- **GET /orders/customer/:customerId**: Get orders by customer ID
- **GET /orders/customers**: Get orders with customer info
- **GET /orders/details**: Get order details
- **GET /orders/total-by-country**: Get order totals by country
- **GET /orders/total-greater-than-1000**: Get orders with total amount greater than 1000
- **GET /orders/above-average**: Get orders above average amount

### Customers
- **GET /customers**: List all customers
- **GET /customers/:id**: Get customer by ID
- **POST /customers**: Create new customer
- **DELETE /customers/:id**: Delete customer

### OrderDetails
- **GET /orderdetails**: List all order details
- **GET /orderdetails/search**: Search order details with pagination
- **GET /orderdetails/:id**: Get order detail by ID
- **POST /orderdetails**: Create new order detail
- **DELETE /orderdetails/:id**: Delete order detail

## Key Implementation Features

### Backend
1. **Stock Validation**: The order service validates that products have sufficient stock before placing orders
2. **Transaction Support**: Database transactions ensure data integrity during order placement
3. **Repository Pattern**: Clean separation of concerns between data access and business logic
4. **Advanced Queries**: Complex SQL queries for reporting and analysis

### Frontend
1. **Responsive Cart**: Dynamic cart management with real-time stock validation
2. **Stock Tracking**: Real-time tracking of available product quantities
3. **API Integration**: Centralized API configuration with environment-based URLs
4. **Component Reusability**: Modular UI components for consistent user experience

## Development Workflow

1. **Backend Development**:
   - Update models/migrations for database schema changes
   - Implement repository methods for data access
   - Add service methods for business logic
   - Create controller methods for handling HTTP requests
   - Define routes for API endpoints

2. **Frontend Development**:
   - Create/update API service methods
   - Implement UI components
   - Set up state management using Context API
   - Build page components
   - Test integration with backend services

## Deployment Considerations

### Backend
- Configure environment variables for production settings
- Set up database connection pooling
- Implement proper error logging
- Configure CORS for production domains

### Frontend
- Build production assets with `npm run build`
- Configure environment variables for production API URLs
- Set up CI/CD pipeline for automated deployment

## Contributors

For questions or issues, contact:
- Email: [thiennguyenhuu3@gmail.com](mailto:thiennguyenhuu3@gmail.com)

## License

This project is licensed under the MIT License.