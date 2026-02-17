type PaginationMeta = {
  total: number;
  newPage: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type PaginatedResult<T> = {
  data: T[];
  meta: PaginationMeta;
};

type PrismaDelegate<
  T,
  FindManyArgs extends { where?: unknown; include?: unknown },
> = {
  findMany(args: FindManyArgs & { skip: number; take: number }): Promise<T[]>;
  count(args: { where?: FindManyArgs["where"] }): Promise<number>;
};

export async function paginate<
  T,
  FindManyArgs extends {
    where?: unknown;
    include?: unknown;
    orderBy?: unknown;
  },
>(
  model: PrismaDelegate<T, FindManyArgs>,
  args: FindManyArgs,
  options: { page?: number; perPage?: number } = {},
  include?: FindManyArgs["include"],
  orderBy?: FindManyArgs["orderBy"],
): Promise<PaginatedResult<T>> {
  const page = options.page ?? 1;
  const perPage = options.perPage ?? 10;

  const skip = (page - 1) * perPage;
  const take = perPage;

  const [data, total] = await Promise.all([
    model.findMany({
      ...args,
      skip,
      take,
      include,
      orderBy: orderBy ?? ({ createdAt: "desc" } as FindManyArgs["orderBy"]),
    }),
    model.count({
      where: args.where,
    }),
  ]);

  const totalPages = Math.ceil(total / perPage);
  let newPage = 1;
  if (page < totalPages) {
    newPage = page + 1;
  } else {
    newPage = page;
  }

  return {
    data,
    meta: {
      total,
      newPage,
      currentPage: page,
      perPage,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
