# TMS Backend - GraphQL API

Transportation Management System GraphQL Backend with authentication, authorization, and performance optimizations.

## Features

- ✅ GraphQL API with Apollo Server
- ✅ Role-based access control (Admin, Employee)
- ✅ JWT Authentication
- ✅ Pagination & Sorting
- ✅ Advanced Filtering
- ✅ DataLoader for N+1 query optimization
- ✅ Query complexity limits
- ✅ Prisma ORM with SQLite

## Quick Start

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Start development server
npm run dev
```

## Test Credentials

**Admin:**
- Email: `admin@tms.com`
- Password: `admin123`

**Employee:**
- Email: `employee@tms.com`
- Password: `employee123`

## API Endpoints

- GraphQL: `http://localhost:4000/graphql`
- Health Check: `http://localhost:4000/health`

## GraphQL Queries & Mutations

### Authentication

```graphql
# Login
mutation {
  login(email: "admin@tms.com", password: "admin123") {
    token
    user {
      id
      email
      name
      role
    }
  }
}

# Register
mutation {
  register(
    email: "newuser@tms.com"
    password: "password123"
    name: "New User"
  ) {
    token
    user {
      id
      email
      name
      role
    }
  }
}
```

### Shipments

```graphql
# List shipments with filters and pagination
query {
  shipments(
    filters: { 
      status: IN_TRANSIT
      priority: HIGH
      search: "FedEx"
    }
    sort: { field: "createdAt", order: DESC }
    page: 1
    limit: 20
  ) {
    nodes {
      id
      shipperName
      carrierName
      status
      priority
      rate
    }
    pageInfo {
      totalCount
      totalPages
      currentPage
      hasNextPage
    }
  }
}

# Get single shipment
query {
  shipment(id: "shipment-id") {
    id
    shipperName
    carrierName
    trackingNumber
    trackingEvents {
      timestamp
      location
      status
      description
    }
  }
}

# Create shipment (requires authentication)
mutation {
  createShipment(input: {
    shipperName: "ABC Corp"
    carrierName: "FedEx"
    pickupLocation: "New York, NY"
    pickupDate: "2026-02-01"
    deliveryLocation: "Los Angeles, CA"
    deliveryDate: "2026-02-05"
    trackingNumber: "TRK123456789"
    rate: 1500
    weight: 250
    dimensions: "50x40x30 cm"
    priority: HIGH
    status: PENDING
  }) {
    id
    trackingNumber
  }
}

# Update shipment (requires authentication)
mutation {
  updateShipment(
    id: "shipment-id"
    input: {
      status: IN_TRANSIT
      priority: URGENT
    }
  ) {
    id
    status
    priority
  }
}

# Delete shipment (admin only)
mutation {
  deleteShipment(id: "shipment-id")
}

# Get statistics (admin only)
query {
  shipmentStats {
    totalShipments
    totalRevenue
    byStatus {
      status
      count
    }
    byPriority {
      priority
      count
    }
  }
}
```

## Authorization

Add the JWT token to request headers:

```
Authorization: Bearer <your-token>
```

## Performance Optimizations

1. **DataLoader**: Batches and caches database queries to prevent N+1 problems
2. **Query Complexity Limits**: Prevents expensive queries (max complexity: 1000)
3. **Pagination**: Limits results (max 100 per page)
4. **Database Indexes**: On status, priority, and createdAt fields
5. **Prisma Connection Pooling**: Efficient database connections

## Role-Based Access

- **Public**: Login, Register
- **Employee**: View shipments, create/update shipments, add tracking events
- **Admin**: All employee permissions + delete shipments, view statistics

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=4000
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with sample data
- `npm run prisma:studio` - Open Prisma Studio GUI
