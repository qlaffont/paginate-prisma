// const prisma = new PrismaClient();

// export interface PageArgs<T> {
//   number?: number;
//   size?: number;
//   sortColumn?: keyof T;
//   sortOrder?: Order;
//   deactivated?: boolean;
// }

// export type Order = 'asc' | 'desc';

// export interface ClientPrisma {
//   ModelName: string;
//   [x: string]: unknown;
// }

// const fakePrisma: ClientPrisma = {} as ClientPrisma;

// export type RespositoryName<T extends ClientPrisma> = Lowercase<T['ModelName']>;
// export type Repository<
//   T extends ClientPrisma,
//   U extends RespositoryName<T>
// > = typeof fakePrisma[U];

// interface PrismaArgs {
//   take?: number;
//   skip?: number;
//   orderBy?: { [x: string]: Order };
// }

// export const paginate = async <
//   Pr extends ClientPrisma,
//   T extends { id: string }
// >(
//   repo: RespositoryName<Pr>,
//   // query: Parameters<Repository<Pr, typeof repo>['findMany']>[0],
//   query: Parameters<Repository<Pr, typeof repo>['findMany']>[0],
//   pageArgs: PageArgs<T> = {}
// ) => {
//   const parsePageArgsToPrisma = (pageArgs: PageArgs<T>) => {
//     const { number, size, sortColumn, sortOrder } = pageArgs;
//     const toReturn: PrismaArgs = {};

//     if (number) toReturn.skip = number;
//     if (size) toReturn.take = size;

//     const order: Order = sortOrder || 'asc';
//     const column: keyof T = sortColumn || 'id';

//     toReturn.orderBy = {
//       [column]: order,
//     };

//     return toReturn;
//   };

//   return prisma[repo].findMany({
//     /** @see: https://stackoverflow.com/a/51193091 */
//     ...Object.assign({}, query),
//     ...parsePageArgsToPrisma(pageArgs),
//   });
// };

// export const paginate = async <
//   Pr extends ClientPrisma,
//   T extends { id: string }
// >(
//   repo: RespositoryName<Pr>,
//   // query: Parameters<Repository<Pr, typeof repo>['findMany']>[0],
//   query: (repository: Repository<Pr, typeof repo>) => Promise<T[]>,
//   pageArgs: PageArgs<T> = {}
// ) => {
//   const parsePageArgsToPrisma = (pageArgs: PageArgs<T>) => {
//     const { number, size, sortColumn, sortOrder } = pageArgs;
//     const toReturn: PrismaArgs = {};

//     if (number) toReturn.skip = number;
//     if (size) toReturn.take = size;

//     const order: Order = sortOrder || 'asc';
//     const column: keyof T = sortColumn || 'id';

//     toReturn.orderBy = {
//       [column]: order,
//     };

//     return toReturn;
//   };

//   return prisma[repo].findMany({
//     /** @see: https://stackoverflow.com/a/51193091 */
//     ...Object.assign({}, query),
//     ...parsePageArgsToPrisma(pageArgs),
//   });
// };
