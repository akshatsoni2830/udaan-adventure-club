import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createDefaultAdmin() {
  console.log('🔐 Creating default admin user...\n');
  
  const username = 'admin';
  const password = 'Admin@123456'; // Change this after first login!

  // Check if admin already exists
  const existing = await prisma.adminUser.findUnique({
    where: { username }
  });

  if (existing) {
    console.log('✅ Admin user already exists!');
    console.log(`Username: ${username}`);
    console.log('\n⚠️  If you forgot your password, delete the admin user and run this script again.');
    await prisma.$disconnect();
    return;
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create admin user
  await prisma.adminUser.create({
    data: {
      username,
      passwordHash
    }
  });

  console.log('✅ Default admin user created successfully!\n');
  console.log('📝 Login Credentials:');
  console.log(`   Username: ${username}`);
  console.log(`   Password: ${password}`);
  console.log('\n🔒 IMPORTANT: Change this password after first login!');
  console.log(`\n🌐 Admin Panel: http://localhost:3000/secure-admin-x9k2p/login`);
  
  await prisma.$disconnect();
}

createDefaultAdmin().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
