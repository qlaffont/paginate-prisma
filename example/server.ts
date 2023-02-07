//@ts-nocheck

import { paginate } from 'paginate-prisma';
import { PAGINATION_ORDER } from 'paginate-prisma/types';

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
