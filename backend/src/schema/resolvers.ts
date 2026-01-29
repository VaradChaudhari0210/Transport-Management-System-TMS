import { PrismaClient, Prisma } from '@prisma/client';
import { AuthContext, requireAuth, requireAdmin, hashPassword, comparePassword, generateToken } from '../utils/auth';

interface Context {
  prisma: PrismaClient;
  auth: AuthContext;
  loaders: {
    userLoader: ReturnType<typeof import('../utils/dataloader').createLoaders>['userLoader'];
    trackingEventsLoader: ReturnType<typeof import('../utils/dataloader').createLoaders>['trackingEventsLoader'];
  };
}

export const resolvers = {
  Query: {
    // Public queries
    me: async (_: any, __: any, context: Context) => {
      requireAuth(context.auth);
      return context.prisma.user.findUnique({
        where: { id: context.auth.userId },
      });
    },

    // Shipment queries (requires authentication)
    shipments: async (
      _: any,
      args: {
        filters?: {
          status?: string;
          priority?: string;
          search?: string;
          flagged?: boolean;
        };
        sort?: {
          field: string;
          order: 'ASC' | 'DESC';
        };
        page?: number;
        limit?: number;
      },
      context: Context
    ) => {
      requireAuth(context.auth);

      const page = args.page || 1;
      const limit = Math.min(args.limit || 20, 100); // Max 100 per page
      const skip = (page - 1) * limit;

      // Build where clause
      const where: Prisma.ShipmentWhereInput = {};

      if (args.filters) {
        if (args.filters.status) {
          where.status = args.filters.status as any;
        }
        if (args.filters.priority) {
          where.priority = args.filters.priority as any;
        }
        if (args.filters.flagged !== undefined) {
          where.flagged = args.filters.flagged;
        }
        if (args.filters.search) {
          const search = args.filters.search.toLowerCase();
          where.OR = [
            { shipperName: { contains: search, mode: 'insensitive' } },
            { carrierName: { contains: search, mode: 'insensitive' } },
            { pickupLocation: { contains: search, mode: 'insensitive' } },
            { deliveryLocation: { contains: search, mode: 'insensitive' } },
            { trackingNumber: { contains: search, mode: 'insensitive' } },
          ];
        }
      }

      // Build orderBy clause
      const orderBy: Prisma.ShipmentOrderByWithRelationInput = {};
      if (args.sort) {
        const field = args.sort.field as keyof Prisma.ShipmentOrderByWithRelationInput;
        orderBy[field] = args.sort.order.toLowerCase() as 'asc' | 'desc';
      } else {
        orderBy.createdAt = 'desc';
      }

      // Execute queries
      const [nodes, totalCount] = await Promise.all([
        context.prisma.shipment.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          select: {
            id: true,
            shipperName: true,
            carrierName: true,
            pickupLocation: true,
            pickupDate: true,
            deliveryLocation: true,
            deliveryDate: true,
            status: true,
            priority: true,
            trackingNumber: true,
            rate: true,
            weight: true,
            dimensions: true,
            specialInstructions: true,
            flagged: true,
            createdAt: true,
            updatedAt: true,
            // Only fetch IDs for relations in list view for performance
            trackingEvents: false,
            createdBy: false,
            updatedBy: false,
          },
        }),
        context.prisma.shipment.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        nodes,
        pageInfo: {
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
          totalCount,
          totalPages,
          currentPage: page,
        },
      };
    },

    shipment: async (_: any, args: { id: string }, context: Context) => {
      requireAuth(context.auth);
      // For detail view, fetch all fields and relations
      return context.prisma.shipment.findUnique({
        where: { id: args.id },
        include: {
          trackingEvents: true,
          createdBy: true,
          updatedBy: true,
        },
      });
    // Note: Prisma uses connection pooling by default for PostgreSQL.
    },

    // Admin only
    shipmentStats: async (_: any, __: any, context: Context) => {
      requireAdmin(context.auth);

      const [totalShipments, byStatus, byPriority, rateSum] = await Promise.all([
        context.prisma.shipment.count(),
        context.prisma.shipment.groupBy({
          by: ['status'],
          _count: { status: true },
        }),
        context.prisma.shipment.groupBy({
          by: ['priority'],
          _count: { priority: true },
        }),
        context.prisma.shipment.aggregate({
          _sum: { rate: true },
        }),
      ]);

      return {
        totalShipments,
        byStatus: byStatus.map((s) => ({ status: s.status, count: s._count.status })),
        byPriority: byPriority.map((p) => ({ priority: p.priority, count: p._count.priority })),
        totalRevenue: rateSum._sum.rate || 0,
      };
    },
  },

  Shipment: {
    createdBy: async (parent: any, _args: any, context: Context) => {
      if (!parent.createdById) return null;
      return context.loaders.userLoader.load(parent.createdById);
    },
    updatedBy: async (parent: any, _args: any, context: Context) => {
      if (!parent.updatedById) return null;
      return context.loaders.userLoader.load(parent.updatedById);
    },
    trackingEvents: async (parent: any, _args: any, context: Context) => {
      return context.loaders.trackingEventsLoader.load(parent.id);
    },
  },

  Mutation: {
    // Public mutations
    login: async (
      _: any,
      args: { email: string; password: string },
      context: Context
    ) => {
      const user = await context.prisma.user.findUnique({
        where: { email: args.email },
      });

      if (!user) {
        throw new Error('Invalid credentials');
      }

      const valid = await comparePassword(args.password, user.password);
      if (!valid) {
        throw new Error('Invalid credentials');
      }

      const token = generateToken(user.id, user.email, user.role);

      return {
        token,
        user,
      };
    },
          const token = generateToken(user.id, user.email, user.name, user.role);
    register: async (
      _: any,
      args: { email: string; password: string; name: string },
      context: Context
    ) => {
      const existingUser = await context.prisma.user.findUnique({
        where: { email: args.email },
      });

      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await hashPassword(args.password);

      const user = await context.prisma.user.create({
        data: {
          email: args.email,
          password: hashedPassword,
          name: args.name,
          role: 'EMPLOYEE', // Default role
        },
      });

      const token = generateToken(user.id, user.email, user.role);

      return {
        token,
        user,
      };
    },
          const token = generateToken(user.id, user.email, user.name, user.role);
    // Authenticated mutations
    createShipment: async (_: any, args: { input: any }, context: Context) => {
      requireAuth(context.auth);

      return context.prisma.shipment.create({
        data: {
          ...args.input,
          createdById: context.auth.userId,
          updatedById: context.auth.userId,
        },
        include: {
          trackingEvents: true,
          createdBy: true,
          updatedBy: true,
        },
      });
    },

    updateShipment: async (
      _: any,
      args: { id: string; input: any },
      context: Context
    ) => {
      requireAuth(context.auth);

      const shipment = await context.prisma.shipment.findUnique({
        where: { id: args.id },
      });

      if (!shipment) {
        throw new Error('Shipment not found');
      }

      return context.prisma.shipment.update({
        where: { id: args.id },
        data: {
          ...args.input,
          updatedById: context.auth.userId,
        },
        include: {
          trackingEvents: true,
          createdBy: true,
          updatedBy: true,
        },
      });
    },

    // Admin only
    deleteShipment: async (_: any, args: { id: string }, context: Context) => {
      requireAdmin(context.auth);

      await context.prisma.shipment.delete({
        where: { id: args.id },
      });

      return true;
    },

    // Add tracking event
    addTrackingEvent: async (
      _: any,
      args: { shipmentId: string; input: any },
      context: Context
    ) => {
      requireAuth(context.auth);

      const shipment = await context.prisma.shipment.findUnique({
        where: { id: args.shipmentId },
      });

      if (!shipment) {
        throw new Error('Shipment not found');
      }

      await context.prisma.trackingEvent.create({
        data: {
          ...args.input,
          shipmentId: args.shipmentId,
        },
      });

      return context.prisma.shipment.findUnique({
        where: { id: args.shipmentId },
        include: {
          trackingEvents: true,
          createdBy: true,
          updatedBy: true,
        },
      });
    },
  },
};
