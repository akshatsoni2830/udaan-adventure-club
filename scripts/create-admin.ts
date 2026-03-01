import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
  console.log('🔐 Create Admin User\n');
  
  const username = await question('Enter admin username: ');
  const password = await question('Enter admin password: ');
  
  if (!username || !password) {
    console.error('❌ Username and password are required');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('❌ Password must be at least 8 characters');
    process.exit(1);
  }

  // Check if admin already exists
  const existing = await prisma.adminUser.findUnique({
    where: { username }
  });

  if (existing) {
    console.error('❌ Admin user already exists');
    process.exit(1);
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

  console.log('\n✅ Admin user created successfully!');
  console.log(`Username: ${username}`);
  console.log('\n🔒 Keep these credentials safe!');
  
  rl.close();
  await prisma.$disconnect();
}

createAdmin().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
