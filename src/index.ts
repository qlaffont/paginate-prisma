import { set } from 'lodash';

import { extractGeneric, ObjectDotNotation, PaginationOptions } from './typing';

export const getPaginationsData = <T>(options: PaginationOptions<T> = {}) =>
  ({
    page: options.page || 1,
    limit: options.limit || 10,
  } as { page: number; limit: number });

export const paginate =
  <T>(prismaModel: T) =>
  async (
    //@ts-ignore
    query: Exclude<
      //@ts-ignore
      Exclude<
        //@ts-ignore
        Parameters<(typeof prismaModel)['findMany']>[0],
        undefined
      >['where'],
      undefined
    > = {},
    paginateOptions: PaginationOptions<
      ObjectDotNotation<
        extractGeneric<
          //@ts-ignore
          Exclude<
            //@ts-ignore
            Parameters<(typeof prismaModel)['findMany']>[0],
            undefined
          >['orderBy']
        >
      >
    > = {},
    //@ts-ignore
    additionalPrismaQuery: Omit<
      //@ts-ignore
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
          //@ts-ignore
          [paginateOptions.sort?.field]:
            paginateOptions.sort?.order.toLowerCase(),
        };
      } else {
        const orderByValue = {};
        //@ts-ignore
        set(orderByValue, field, paginateOptions.sort?.order.toLowerCase());
        orderBy = orderByValue;
      }
    }
    //@ts-ignore
    const data = await (prismaModel.findMany({
      where: query,
      ...(paginateOptions?.disablePagination
        ? {}
        : { skip: (page - 1) * limit, orderBy, take: limit }),
      ...additionalPrismaQuery,
      //@ts-ignore
    }) as ReturnType<(typeof prismaModel)['findMany']>);

    //@ts-ignore
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
