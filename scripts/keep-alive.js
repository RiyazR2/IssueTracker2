// Keep Supabase project alive by pinging it weekly
// Run this script with: node scripts/keep-alive.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function keepAlive() {
  try {
    console.log('Pinging database to keep it alive...');
    
    // Simple query to keep the connection active
    const result = await prisma.$executeRaw`SELECT 1`;
    
    console.log('✅ Database is active!', new Date().toISOString());
    
  } catch (error) {
    console.error('❌ Error pinging database:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

keepAlive();
