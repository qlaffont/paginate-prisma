[![Maintainability](https://api.codeclimate.com/v1/badges/6b08ca1cc22333d5e1be/maintainability)](https://codeclimate.com/github/flexper/paginate-prisma/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/6b08ca1cc22333d5e1be/test_coverage)](https://codeclimate.com/github/flexper/paginate-prisma/test_coverage)
![npm](https://img.shields.io/npm/v/paginate-prisma) ![npm](https://img.shields.io/npm/dm/paginate-prisma) ![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/paginate-prisma) ![NPM](https://img.shields.io/npm/l/paginate-prisma)
# Paginate Prisma

A TS plugin wrapping pagination for Prisma ORM

## Install

```sh
pnpm i paginate-prisma
```

## Use

```typescript
import { paginate, PAGINATION_ORDER } from 'paginate-prisma';

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
```

For type-graphql integration, check example/type.ts

## API

### paginate(prismaModel)(query, sortingOptions, additionalFindMany)

**Options**

| Field Name         | Type                    | Description                                        |
| ------------------ | ----------------------- | -------------------------------------------------- |
| prismaModel        | Prisma Model            | Prisma model/table/entity to use                   |
| sortingOptions     | PaginationOptions       | Options to use for pagination (Page, sorting, etc) |
| additionalFindMany | Prisma FindManyArgument | Other params in findMany as include, cursor, etc   |

**Return** `Promise<PaginationResult & {data: T[]}>`

| Field Name | Type   | Description                  |
| ---------- | ------ | ---------------------------- |
| data       | T[]    | Paginated Data               |
| page       | number | Current page                 |
| pages      | number | Total number of pages        |
| limit      | number | Number of row to be returned |
| items      | number | Total number of items        |

## Test

To test this package, you need to run a PostgresSQL server :

```bash

docker-compose up -d
chmod -R 777 docker
pnpm prisma migrate deploy
pnpm test
```

## Maintain

This package use [TSdx](https://github.com/jaredpalmer/tsdx). Please check documentation to update this package.

