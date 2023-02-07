//@ts-nocheck

import { set } from 'lodash';

import { PaginationOptions } from './types';

export const getPaginationsData = <T>(options: PaginationOptions<T> = {}) =>
  ({
    page: options.page || 1,
    limit: options.limit || 10,
  } as { page: number; limit: number });

type TypeWithGeneric<T> = T[];
type extractGeneric<Type> = Type extends TypeWithGeneric<infer X> ? X : never;

type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

type Join<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer R]
  ? F extends string
    ? `${F}${D}${Join<Extract<R, string[]>, D>}`
    : never
  : string;

type DottedLanguageObjectStringPaths<T> = Join<PathsToStringProps<T>, '.'>;

export const paginate =
  <T>(prismaModel: T) =>
  async (
    query: Exclude<
      Exclude<
        Parameters<(typeof prismaModel)['findMany']>[0],
        undefined
      >['where'],
      undefined
    > = {},
    paginateOptions: PaginationOptions<
      DottedLanguageObjectStringPaths<
        extractGeneric<
          Exclude<
            Parameters<(typeof prismaModel)['findMany']>[0],
            undefined
          >['orderBy']
        >
      >
    > = {},
    additionalPrismaQuery: Omit<
      Exclude<Parameters<(typeof prismaModel)['findMany']>[0], undefined>,
      'where' | 'skip' | 'take' | 'orderBy'
    > = {}
  ) => {
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

    const data = await (prismaModel.findMany({
      where: query,
      ...(paginateOptions?.disablePagination
        ? {}
        : { skip: (page - 1) * limit, orderBy, take: limit }),
      ...additionalPrismaQuery,
    }) as ReturnType<(typeof prismaModel)['findMany']>);

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
