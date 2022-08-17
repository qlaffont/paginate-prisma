import { Prisma, PrismaClient } from 'prisma';

const prisma = new PrismaClient();

export interface PageArgs<T> {
  number?: number;
  size?: number;
  sortColumn?: keyof T;
  sortOrder?: Order;
}

export type Order = 'asc' | 'desc';

export type RespositoryName = Lowercase<Prisma.ModelName>;
export type Repository<T extends RespositoryName> = typeof prisma[T];

interface PrismaArgs {
  take?: number;
  skip?: number;
  orderBy?: { [x: string]: Order };
}

export const paginate = async <T extends { id: string }>(
  repo: RespositoryName,
  query: Parameters<Repository<typeof repo>['findMany']>[0],
  pageArgs: PageArgs<T> = {}
) => {
  const parsePageArgsToPrisma = (pageArgs: PageArgs<T>) => {
    const { number, size, sortColumn, sortOrder } = pageArgs;
    const toReturn: PrismaArgs = {};

    if (number) toReturn.skip = number;
    if (size) toReturn.take = size;

    const order: Order = sortOrder || 'asc';
    const column: keyof T = sortColumn || 'id';

    toReturn.orderBy = {
      [column]: order,
    };

    return toReturn;
  };

  return prisma[repo].findMany({
    /** @see: https://stackoverflow.com/a/51193091 */
    ...Object.assign({}, query),
    ...parsePageArgsToPrisma(pageArgs),
  });
};
