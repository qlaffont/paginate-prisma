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
