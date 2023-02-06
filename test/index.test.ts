/**
 * @jest-environment node
 */

import 'reflect-metadata';

import { beforeAll } from '@jest/globals';
import { describe, expect, it } from '@jest/globals';

import { PrismaClient } from '../prisma/generated/prisma-client-lib.ts';
import { paginate } from '../src/index';
import { PAGINATION_ORDER } from '../src/types/Pagination';
// import { seeding } from './utils/seeding';

const prisma = new PrismaClient();

//TODO: add Seeding
//TODO: Check coverage

describe('Paginate function', () => {
  beforeAll(() => {
    // return seeding();
  });

  it('should be able the same data as query', async () => {
    const prismaResult = await prisma.user.findMany({
      orderBy: {
        username: 'asc',
      },
    });

    const libResult = await paginate(prisma.user)(
      {},
      {
        sort: {
          field: 'username',
          order: PAGINATION_ORDER.ASC,
        },
      }
    );

    expect(prismaResult[0]).toEqual(libResult.data[0]);
    expect(prismaResult[1]).toEqual(libResult.data[1]);
  });
});
