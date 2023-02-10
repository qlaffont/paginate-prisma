import { Max, Min } from 'class-validator';
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
export type extractGeneric<Type> = Type extends TypeWithGeneric<infer X>
  ? X
  : never;

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

export type PaginationOptionsFromPrisma<T> = PaginationOptions<
  ObjectDotNotation<
    extractGeneric<
      //@ts-ignore
      Exclude<
        //@ts-ignore
        Parameters<T['findMany']>[0],
        undefined
      >['orderBy']
    >
  >
>;
