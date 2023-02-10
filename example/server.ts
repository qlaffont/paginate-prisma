//@ts-nocheck

import { paginate, PAGINATION_ORDER } from 'paginate-prisma';

const prisma = new PrismaClient();
await paginate(prisma.user)(
  {},
  {
    sort: {
      field: 'tokens._count',
      order: PAGINATION_ORDER.ASC,
    },
  }
);
