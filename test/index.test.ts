/**
 * @jest-environment node
 */

import 'reflect-metadata';

//Polyfill for issue with github
global.atob = (a) => Buffer.from(a, 'base64').toString('binary');

global.btoa = (b) => Buffer.from(b).toString('base64');

import { afterAll, beforeAll } from '@jest/globals';
import { describe, expect, it } from '@jest/globals';

import { PrismaClient } from '../prisma/generated/prisma-client-lib.ts';
import { paginate, PAGINATION_ORDER } from '../src/index';
import { cleanSeeding, seeding } from './utils/seeding';

const prisma = new PrismaClient();

describe('Paginate function', () => {
  beforeAll(() => {
    return seeding();
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

  it('should be able the sort by tokens relations', async () => {
    const prismaResult = await prisma.user.findMany({
      orderBy: {
        tokens: {
          _count: 'asc',
        },
      },
    });

    const libResult = await paginate(prisma.user)(
      {},
      {
        sort: {
          field: 'tokens._count',
          order: PAGINATION_ORDER.ASC,
        },
      }
    );

    expect(prismaResult[0]).toEqual(libResult.data[0]);
    expect(prismaResult[1]).toEqual(libResult.data[1]);
  });

  afterAll(() => {
    return cleanSeeding();
  });
});
