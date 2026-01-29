import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';

export const createLoaders = (prisma: PrismaClient) => {
  // User loader for batching user queries
  const userLoader = new DataLoader(async (userIds: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: { id: { in: [...userIds] } },
    });

    const userMap = new Map(users.map((user) => [user.id, user]));
    return userIds.map((id) => userMap.get(id) || null);
  });

  // Tracking events loader for batching tracking event queries
  const trackingEventsLoader = new DataLoader(
    async (shipmentIds: readonly string[]) => {
      const events = await prisma.trackingEvent.findMany({
        where: { shipmentId: { in: [...shipmentIds] } },
        orderBy: { timestamp: 'desc' },
      });

      const eventMap = new Map<string, any[]>();
      events.forEach((event) => {
        if (!eventMap.has(event.shipmentId)) {
          eventMap.set(event.shipmentId, []);
        }
        eventMap.get(event.shipmentId)!.push(event);
      });

      return shipmentIds.map((id) => eventMap.get(id) || []);
    }
  );

  return {
    userLoader,
    trackingEventsLoader,
  };
};

// Query complexity calculator for performance optimization
export const queryComplexityPlugin = {
  requestDidStart: async () => ({
    async didResolveOperation(requestContext: any) {
      const query = requestContext.document;
      const complexity = calculateComplexity(query);
      
      // Limit query complexity to prevent abuse
      if (complexity > 1000) {
        throw new Error(
          `Query is too complex: ${complexity}. Maximum allowed complexity: 1000`
        );
      }
    },
  }),
};

function calculateComplexity(document: any): number {
  let complexity = 0;
  
  // Basic complexity calculation
  // Each field = 1 point
  // Nested fields = parent points * child points
  // Lists = field points * estimated items
  
  // Simplified implementation
  const definitions = document.definitions || [];
  definitions.forEach((def: any) => {
    if (def.selectionSet) {
      complexity += countSelections(def.selectionSet, 1);
    }
  });
  
  return complexity;
}

function countSelections(selectionSet: any, multiplier: number): number {
  if (!selectionSet || !selectionSet.selections) return 0;
  
  let count = 0;
  selectionSet.selections.forEach((selection: any) => {
    count += multiplier;
    if (selection.selectionSet) {
      // For lists, multiply complexity
      const childMultiplier = selection.name?.value === 'shipments' ? 20 : 1;
      count += countSelections(selection.selectionSet, multiplier * childMultiplier);
    }
  });
  
  return count;
}
