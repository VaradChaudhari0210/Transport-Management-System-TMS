import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/auth';

const prisma = new PrismaClient();

const shipmentStatuses = ['PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'DELAYED'];
const shipmentPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

const carriers = ['FedEx', 'UPS', 'DHL', 'USPS', 'Blue Dart', 'XPO Logistics'];
const shippers = ['ABC Corp', 'XYZ Ltd', 'Global Shipping Inc', 'Tech Solutions', 'Fashion Retail'];

const locations = [
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
  'San Antonio, TX',
  'San Diego, CA',
  'Dallas, TX',
  'San Jose, CA',
  'Mumbai, India',
  'Delhi, India',
  'Bangalore, India',
  'London, UK',
  'Paris, France',
];

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomDate(start: Date, end: Date): string {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split('T')[0];
}

function generateTrackingNumber(): string {
  return `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.trackingEvent.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.user.deleteMany();

  console.log('✨ Creating users...');

  // Create admin user
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@tms.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create employee user
  const employeePassword = await hashPassword('employee123');
  const employee = await prisma.user.create({
    data: {
      email: 'employee@tms.com',
      password: employeePassword,
      name: 'Employee User',
      role: 'EMPLOYEE',
    },
  });

  console.log('✨ Creating shipments...');

  const startDate = new Date(2024, 0, 1);
  const endDate = new Date();

  // Create 50 shipments
  const shipments = [];
  for (let i = 0; i < 50; i++) {
    const pickupDate = randomDate(startDate, endDate);
    const deliveryDate = randomDate(new Date(pickupDate), endDate);

    const shipment = await prisma.shipment.create({
      data: {
        shipperName: randomItem(shippers),
        carrierName: randomItem(carriers),
        pickupLocation: randomItem(locations),
        pickupDate,
        deliveryLocation: randomItem(locations.filter((l) => l !== pickupDate)),
        deliveryDate,
        status: randomItem(shipmentStatuses) as any,
        priority: randomItem(shipmentPriorities) as any,
        trackingNumber: generateTrackingNumber(),
        rate: Math.floor(Math.random() * 5000) + 500,
        weight: Math.floor(Math.random() * 1000) + 10,
        dimensions: `${Math.floor(Math.random() * 50) + 10}x${
          Math.floor(Math.random() * 50) + 10
        }x${Math.floor(Math.random() * 50) + 10} cm`,
        specialInstructions:
          Math.random() > 0.7 ? 'Handle with care - Fragile items' : undefined,
        flagged: Math.random() > 0.8,
        createdById: Math.random() > 0.5 ? admin.id : employee.id,
        updatedById: Math.random() > 0.5 ? admin.id : employee.id,
      },
    });

    shipments.push(shipment);

    // Create tracking events for each shipment
    const numEvents = Math.floor(Math.random() * 5) + 1;
    for (let j = 0; j < numEvents; j++) {
      const eventDate = new Date(pickupDate);
      eventDate.setDate(eventDate.getDate() + j);

      await prisma.trackingEvent.create({
        data: {
          timestamp: eventDate.toISOString(),
          location: randomItem(locations),
          status: randomItem(['In Transit', 'Out for Delivery', 'Arrived at Hub', 'Departed']),
          description: `Package ${randomItem([
            'scanned',
            'arrived',
            'departed',
            'in transit',
          ])} at facility`,
          shipmentId: shipment.id,
        },
      });
    }
  }

  console.log('✅ Seed completed successfully!');
  console.log('\n📝 Test Credentials:');
  console.log('Admin: admin@tms.com / admin123');
  console.log('Employee: employee@tms.com / employee123');
  console.log(`\n📦 Created ${shipments.length} shipments`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
