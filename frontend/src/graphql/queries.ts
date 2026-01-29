export const GET_SHIPMENT_STATS = gql`
  query GetShipmentStats {
    shipmentStats {
      totalShipments
      byStatus { status count }
      byPriority { priority count }
      totalRevenue
    }
  }
`;
import { gql } from '@apollo/client';

export const GET_SHIPMENTS = gql`
  query GetShipments(
    $page: Int
    $limit: Int
    $filters: ShipmentFilters
    $sort: ShipmentSort
  ) {
    shipments(page: $page, limit: $limit, filters: $filters, sort: $sort) {
      nodes {
        id
        shipperName
        carrierName
        pickupLocation
        pickupDate
        deliveryLocation
        deliveryDate
        status
        priority
        trackingNumber
        rate
        weight
        dimensions
        specialInstructions
        flagged
        createdAt
        updatedAt
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        totalCount
        totalPages
        currentPage
      }
    }
  }
`;

export const GET_SHIPMENT = gql`
  query GetShipment($id: ID!) {
    shipment(id: $id) {
      id
      shipperName
      carrierName
      pickupLocation
      pickupDate
      deliveryLocation
      deliveryDate
      status
      priority
      trackingNumber
      rate
      weight
      dimensions
      specialInstructions
      flagged
      createdAt
      updatedAt
      trackingEvents {
        id
        timestamp
        location
        status
        description
      }
      createdBy {
        id
        name
        email
      }
      updatedBy {
        id
        name
        email
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($email: String!, $password: String!, $name: String!) {
    register(email: $email, password: $password, name: $name) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export const CREATE_SHIPMENT = gql`
  mutation CreateShipment($input: CreateShipmentInput!) {
    createShipment(input: $input) {
      id
      shipperName
      carrierName
      pickupLocation
      pickupDate
      deliveryLocation
      deliveryDate
      status
      priority
      trackingNumber
      rate
      weight
      dimensions
      specialInstructions
      flagged
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_SHIPMENT = gql`
  mutation UpdateShipment($id: ID!, $input: UpdateShipmentInput!) {
    updateShipment(id: $id, input: $input) {
      id
      shipperName
      carrierName
      pickupLocation
      pickupDate
      deliveryLocation
      deliveryDate
      status
      priority
      trackingNumber
      rate
      weight
      dimensions
      specialInstructions
      flagged
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_SHIPMENT = gql`
  mutation DeleteShipment($id: ID!) {
    deleteShipment(id: $id)
  }
`;
