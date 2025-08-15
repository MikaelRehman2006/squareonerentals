const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const user = await prisma.user.create({
      data: {
        email: 'mikaelr112@gmail.com',
        name: 'Mikael',
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    });
    console.log('Admin user created:', user);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 