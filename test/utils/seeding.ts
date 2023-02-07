import { PrismaClient } from '../../prisma/generated/prisma-client-lib.ts';

export const seeding = async () => {
  const prisma = new PrismaClient();

  //Create User Datas
  await prisma.user.create({
    data: {
      username: 'toto1',
    },
  });

  await prisma.user.create({
    data: {
      username: 'toto2',
    },
  });

  await prisma.user.create({
    data: {
      username: 'toto3',
    },
  });
};

export const cleanSeeding = async () => {
  const prisma = new PrismaClient();

  await prisma.user.deleteMany({
    where: {},
  });
};
