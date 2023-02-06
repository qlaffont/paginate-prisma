//@ts-nocheck

import { set } from 'lodash';

import { PaginationOptions } from './types/Pagination';

export const getPaginationsData = <T>(options: PaginationOptions<T> = {}) =>
  ({
    page: options.page || 1,
    limit: options.limit || 10,
  } as { page: number; limit: number });

type BreakDownObject<O, R = void> = {
  [K in keyof O as string]: K extends string
    ? R extends string
      ? ObjectDotNotation<O[K], `${R}.${K}`>
      : ObjectDotNotation<O[K], K>
    : never;
};

type ObjectDotNotation<O, R = void> = O extends string
  ? R extends string
    ? R
    : never
  : BreakDownObject<O, R>[keyof BreakDownObject<O, R>];

type TypeWithGeneric<T> = T[];
type extractGeneric<Type> = Type extends TypeWithGeneric<infer X> ? X : never;

type KeysOfUnion<T> = T extends T ? keyof T : never;

export const paginate =
  <T>(prismaModel: T) =>
  async (
    query: Exclude<
      Exclude<
        Parameters<typeof prismaModel['findMany']>[0],
        undefined
      >['where'],
      undefined
    >,
    paginateOptions: PaginationOptions<
      KeysOfUnion<
        extractGeneric<
          Exclude<
            Parameters<typeof prismaModel['findMany']>[0],
            undefined
          >['orderBy']
        >
      >
    > = {},
    additionalPrismaQuery: Omit<
      Exclude<Parameters<typeof prismaModel['findMany']>[0], undefined>,
      'where' | 'skip' | 'take' | 'orderBy'
    > = {}
  ) => {
    // type ty = extractGeneric<
    //   Exclude<
    //     Parameters<typeof prisma[typeof model]['findMany']>[0],
    //     undefined
    //   >['orderBy']
    // >;

    // const test: keyof Required<ty> = '';

    const { page, limit } = getPaginationsData<typeof paginateOptions>({
      page: paginateOptions?.page,
      limit: paginateOptions?.limit,
    });

    let orderBy = {};

    if (paginateOptions.sort?.field) {
      const field = paginateOptions.sort?.field;

      if ((field as string).indexOf('.') === -1) {
        orderBy = {
          [paginateOptions.sort?.field]:
            paginateOptions.sort?.order.toLowerCase(),
        };
      } else {
        const orderByValue = {};

        set(orderByValue, field, paginateOptions.sort?.order.toLowerCase());
        orderBy = orderByValue;
      }
    }

    const data = await prismaModel.findMany({
      where: query,
      ...(paginateOptions?.disablePagination
        ? {}
        : { skip: (page - 1) * limit, orderBy, take: limit }),
      ...additionalPrismaQuery,
    });

    const items = await prismaModel.count({
      where: query,
    });

    const pages = paginateOptions?.disablePagination
      ? 0
      : Math.ceil((items || 0) / limit);

    return {
      data,
      pages,
      page,
      limit,
      items,
    };
  };
