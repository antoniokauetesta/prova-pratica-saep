import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
await prisma.tarefa.deleteMany();
await prisma.usuario.deleteMany();
await prisma.$disconnect();