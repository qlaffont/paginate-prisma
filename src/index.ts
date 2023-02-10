import { Max, Min } from 'class-validator';
import { set } from 'lodash';
import {
  Field,
  InputType,
  Int,
  InterfaceType,
  registerEnumType,
} from 'type-graphql';

export enum PAGINATION_ORDER {
  ASC = 'ASC',
  DESC = 'DESC',
}
registerEnumType(PAGINATION_ORDER, {
  name: 'PAGINATION_ORDER',
  description: undefined,
});

@InputType()
export class PaginationOrder<T> {
  @Field(() => String)
  field!: T;

  @Field(() => PAGINATION_ORDER, { defaultValue: PAGINATION_ORDER.ASC })
  order!: PAGINATION_ORDER;
}

@InputType()
export class PaginationOptions<T> {
  @Min(1)
  @Field(() => Int, { defaultValue: 1, nullable: true })
  page?: number;

  @Field(() => Boolean, { defaultValue: false, nullable: true })
  disablePagination?: boolean;

  @Min(1)
  @Max(20)
  @Field(() => Int, { defaultValue: 10, nullable: true })
  limit?: number;

  @Field(() => PaginationOrder, { nullable: true })
  sort?: PaginationOrder<T>;
}

@InterfaceType()
export class PaginationResult {
  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  pages!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  items!: number;
}

type TypeWithGeneric<T> = T[];
type extractGeneric<Type> = Type extends TypeWithGeneric<infer X> ? X : never;
type BreakDownObject<O, R = void> = {
  [K in keyof O as string]: K extends string
    ? R extends string
      ? ObjectDotNotation<O[K], `${R}.${K}`>
      : ObjectDotNotation<O[K], K>
    : never;
};

export type ObjectDotNotation<O, R = void> = O extends string
  ? R extends string
    ? R
    : never
  : BreakDownObject<O, R>[keyof BreakDownObject<O, R>];

export type KeysFromPrismaModel<T> = ObjectDotNotation<
  extractGeneric<
    //@ts-ignore
    Exclude<
      //@ts-ignore
      Parameters<T['findMany']>[0],
      undefined
    >['orderBy']
  >
>;

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
      KeysFromPrismaModel<typeof prismaModel>
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
