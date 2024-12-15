import { prisma } from './lib/prisma';

async function testConnection() {
  try {
    const users = await prisma.user.findMany();
    console.log('데이터베이스 연결 성공:', users);
  } catch (error) {
    console.error('데이터베이스 연결 실패:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
