export const typeDefs = `#graphql
  # User Types
  enum Role {
    ADMIN
    EMPLOYEE
  }

  type User {
    id: ID!
    email: String!
    name: String!
    role: Role!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  # Shipment Types
  enum ShipmentStatus {
    PENDING
    IN_TRANSIT
    DELIVERED
    CANCELLED
    DELAYED
  }

  enum ShipmentPriority {
    LOW
    MEDIUM
    HIGH
    URGENT
  }

  type TrackingEvent {
    id: ID!
    timestamp: String!
    location: String!
    status: String!
    description: String!
  }

  type Shipment {
    id: ID!
    shipperName: String!
    carrierName: String!
    pickupLocation: String!
    pickupDate: String!
    deliveryLocation: String!
    deliveryDate: String!
    status: ShipmentStatus!
    priority: ShipmentPriority!
    trackingNumber: String!
    rate: Float!
    weight: Float!
    dimensions: String!
    specialInstructions: String
    flagged: Boolean!
    createdAt: String!
    updatedAt: String!
    trackingEvents: [TrackingEvent!]!
    createdBy: User
    updatedBy: User
  }

  # Pagination
  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    totalCount: Int!
    totalPages: Int!
    currentPage: Int!
  }

  type ShipmentConnection {
    nodes: [Shipment!]!
    pageInfo: PageInfo!
  }

  # Inputs
  input ShipmentFilters {
    status: ShipmentStatus
    priority: ShipmentPriority
    search: String
    flagged: Boolean
  }

  enum SortOrder {
    ASC
    DESC
  }

  input ShipmentSort {
    field: String!
    order: SortOrder!
  }

  input CreateShipmentInput {
    shipperName: String!
    carrierName: String!
    pickupLocation: String!
    pickupDate: String!
    deliveryLocation: String!
    deliveryDate: String!
    status: ShipmentStatus
    priority: ShipmentPriority
    trackingNumber: String!
    rate: Float!
    weight: Float!
    dimensions: String!
    specialInstructions: String
    flagged: Boolean
  }

  input UpdateShipmentInput {
    shipperName: String
    carrierName: String
    pickupLocation: String
    pickupDate: String
    deliveryLocation: String
    deliveryDate: String
    status: ShipmentStatus
    priority: ShipmentPriority
    trackingNumber: String
    rate: Float
    weight: Float
    dimensions: String
    specialInstructions: String
    flagged: Boolean
  }

  input AddTrackingEventInput {
    timestamp: String!
    location: String!
    status: String!
    description: String!
  }

  # Queries
  type Query {
    # Authentication (public)
    me: User

    # Shipment Queries (requires authentication)
    shipments(
      filters: ShipmentFilters
      sort: ShipmentSort
      page: Int
      limit: Int
    ): ShipmentConnection!

    shipment(id: ID!): Shipment

    # Statistics (admin only)
    shipmentStats: ShipmentStats!
  }

  type ShipmentStats {
    totalShipments: Int!
    byStatus: [StatusCount!]!
    byPriority: [PriorityCount!]!
    totalRevenue: Float!
  }

  type StatusCount {
    status: ShipmentStatus!
    count: Int!
  }

  type PriorityCount {
    priority: ShipmentPriority!
    count: Int!
  }

  # Mutations
  type Mutation {
    # Authentication (public)
    login(email: String!, password: String!): AuthPayload!
    register(email: String!, password: String!, name: String!): AuthPayload!

    # Shipment Mutations (requires authentication)
    createShipment(input: CreateShipmentInput!): Shipment!
    updateShipment(id: ID!, input: UpdateShipmentInput!): Shipment!
    
    # Admin only mutations
    deleteShipment(id: ID!): Boolean!
    
    # Tracking events (requires authentication)
    addTrackingEvent(shipmentId: ID!, input: AddTrackingEventInput!): Shipment!
  }
`;
