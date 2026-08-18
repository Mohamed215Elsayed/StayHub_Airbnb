import {
  AggregateOptions,
  HydratedDocument,
  Model,
  PipelineStage,
  QueryOptions,
  UpdateQuery,
  ClientSession,
} from 'mongoose';

/**
 * Options for the {@link BaseRepository.create} method.
 */
export interface CreateOptions {
  /**
   * Optional MongoDB session for transaction support.
   */
  session?: ClientSession;
}

/**
 * Options for the {@link BaseRepository.findPaginated} method.
 */
export interface FindPaginatedOptions extends QueryOptions {
  /**
   * Page number (1-based). Defaults to `1` if not provided.
   */
  page?: number;

  /**
   * Number of documents per page. Defaults to `10` if not provided.
   */
  limit?: number;

  /**
   * When `true`, ignores the `limit` option and returns all matching documents.
   */
  ignoreLimit?: boolean;
}

/**
 * Options for the {@link BaseRepository.paginatedAggregation} method.
 */
export interface PaginatedAggregationOptions {
  /**
   * Page number (1-based). Defaults to `1` if not provided.
   */
  page?: number;

  /**
   * Number of documents per page. Defaults to `10` if not provided.
   */
  limit?: number;

  /**
   * When `true`, ignores the `limit` option and returns all matching documents.
   */
  ignoreLimit?: boolean;

  /**
   * Optional MongoDB session for transaction support.
   */
  session?: ClientSession;
}

/**
 * Options for the {@link BaseRepository.updateMany} method.
 */
export interface UpdateManyOptions {
  /**
   * Optional MongoDB session for transaction support.
   */
  session?: ClientSession;
}

/**
 * Options for the {@link BaseRepository.findByIdAndDelete} method.
 */
export interface FindByIdAndDeleteOptions {
  /**
   * Optional MongoDB session for transaction support.
   */
  session?: ClientSession;
}

/**
 * Options for the {@link BaseRepository.deleteMany} method.
 */
export interface DeleteManyOptions {
  /**
   * Optional MongoDB session for transaction support.
   */
  session?: ClientSession;
}

/**
 * Options for the {@link BaseRepository.findOne} method.
 */
export interface FindOneOptions {
  /**
   * Optional MongoDB session for transaction support.
   */
  session?: ClientSession;
}

/**
 * Options for the {@link BaseRepository.findOneAndDelete} method.
 */
export interface FindOneAndDeleteOptions {
  /**
   * Optional MongoDB session for transaction support.
   */
  session?: ClientSession;
}

/**
 * Extended options for the {@link BaseRepository.find} method.
 */
export interface FindOptions extends QueryOptions {
  /**
   * Optional projection to include/exclude fields (e.g., `'+refreshToken'`).
   */
  projection?: Record<string, 0 | 1> | string;
}

/**
 * Generic paginated result wrapper returned by paginated queries.
 *
 * @template T The type of the documents in the result set.
 */
export class PaginatedResult<T> {
  /** Array of matched documents for the current page. */
  data: Array<T>;

  /** Total number of documents matching the query across all pages. */
  totalCount: number;

  /** Current page number (1-based), or `undefined` if not paginated. */
  page: number | undefined;

  /** Number of documents per page, or `undefined` if not paginated. */
  limit: number | undefined;

  /** Total number of pages calculated from `totalCount` and `limit`. */
  pageCount: number;

  /**
   * Creates a new paginated result.
   *
   * @param data - Array of matched documents for the current page.
   * @param totalCount - Total number of matching documents.
   * @param page - Current page number (1-based).
   * @param limit - Number of documents per page.
   */
  constructor(
    data: Array<T>,
    totalCount: number,
    page?: number,
    limit?: number,
  ) {
    this.data = data;
    this.totalCount = totalCount;
    this.page = page;
    this.limit = limit;
    this.pageCount = Math.ceil(totalCount / (limit || 0)) || 0;
  }
}

/**
 * Base repository providing common CRUD and aggregation operations for a Mongoose model.
 *
 * @template T The Mongoose document type.
 */
export class BaseRepository<T> {
  /**
   * The Mongoose model associated with this repository.
   */
  constructor(public readonly model: Model<T>) {}

  /**
   * Creates a new document and persists it to the database.
   *
   * @param body - Partial document data to insert.
   * @param options - Optional create options, such as a transaction session.
   * @returns The saved hydrated document.
   *
   * @example
   * const user = await repo.create({ name: 'John', email: 'john@example.com' });
   */
  async create(
    body: Partial<T>,
    options?: CreateOptions,
  ): Promise<HydratedDocument<T>> {
    const document = new this.model(body);

    await document.save({
      session: options?.session,
    });

    return document;
  }

  /**
   * Finds a single document by its `_id`.
   *
   * @param id - The document ID to query.
   * @param options - Optional Mongoose query options. Defaults to `{ lean: true }`.
   * @returns The matched document, or `null` if not found.
   *
   * @example
   * const user = await repo.findById('507f1f77bcf86cd799439011');
   */
  async findById(id: string | number, options: QueryOptions = { lean: true }) {
    const document = await this.model.findById(id, undefined, options);

    return document;
  }

  /**
   * Finds all documents matching the provided filter query.
   *
   * @param filterQuery - Optional MongoDB filter. Pass `undefined` or `{}` to match all.
   * @param options - Optional Mongoose query options (e.g., `lean`, `sort`, `populate`).
   * @returns An array of matched documents.
   *
   * @example
   * const users = await repo.find({ isActive: true });
   */
  async find(filterQuery?: Record<string, unknown>, options: FindOptions = {}) {
    const { projection, ...queryOptions } = options;
    const documents = await this.model.find(
      filterQuery,
      projection,
      queryOptions,
    );

    return documents;
  }

  /**
   * Finds the first document matching the provided filter query.
   *
   * Always uses `lean: true` internally unless overridden by session-only options.
   *
   * @param filterQuery - Optional MongoDB filter.
   * @param options - Optional options, such as a transaction session.
   * @returns The first matched document, or `null` if not found.
   *
   * @example
   * const user = await repo.findOne({ email: 'john@example.com' });
   */
  async findOne(
    filterQuery?: Record<string, unknown>,
    options?: FindOneOptions & { lean?: boolean },
    projection?: Record<string, 0 | 1> | string,
  ) {
    const document = await this.model.findOne(filterQuery, projection, {
      session: options?.session,
      lean: options?.lean ?? true,
    });

    return document;
  }

  /**
   * Finds a document by `_id` and updates it atomically.
   *
   * Returns the updated document by default (`returnDocument: 'after'`).
   *
   * @param id - The document ID to update.
   * @param updateQuery - The MongoDB update operations (e.g., `{ $set: { name: 'New' } }`).
   * @param options - Optional Mongoose query options merged over defaults.
   * @returns The updated document, or `null` if not found.
   *
   * @example
   * const updated = await repo.findByIdAndUpdate(id, { $set: { name: 'Jane' } });
   */
  async findByIdAndUpdate(
    id: string | number,
    updateQuery: UpdateQuery<HydratedDocument<T>>,
    options: QueryOptions = {},
  ) {
    const document = await this.model.findByIdAndUpdate(id, updateQuery, {
      returnDocument: 'after',
      ...options,
    });

    return document;
  }

  /**
   * Finds the first document matching the filter and updates it atomically.
   *
   * Returns the updated document by default (`returnDocument: 'after'`).
   *
   * @param filterQuery - MongoDB filter to locate the document.
   * @param updateQuery - The MongoDB update operations.
   * @param options - Optional Mongoose query options merged over defaults.
   * @returns The updated document, or `null` if not found.
   *
   * @example
   * const updated = await repo.findOneAndUpdate({ email: 'john@example.com' }, { $set: { name: 'Jane' } });
   */
  async findOneAndUpdate(
    filterQuery: Record<string, unknown>,
    updateQuery: UpdateQuery<HydratedDocument<T>>,
    options: QueryOptions = {},
  ) {
    const document = await this.model.findOneAndUpdate(
      filterQuery,
      updateQuery,
      {
        returnDocument: 'after',
        ...options,
      },
    );

    return document;
  }

  /**
   * Finds a document by `_id` and deletes it permanently.
   *
   * @param id - The document ID to delete.
   * @param options - Optional options, such as a transaction session.
   * @returns The deleted document, or `null` if not found.
   *
   * @example
   * const deleted = await repo.findByIdAndDelete('507f1f77bcf86cd799439011');
   */
  async findByIdAndDelete(
    id: string | number,
    options?: FindByIdAndDeleteOptions,
  ) {
    const document = await this.model.findByIdAndDelete(id, {
      session: options?.session,
    });

    return document;
  }

  /**
   * Executes an aggregation pipeline against the model's collection.
   *
   * @template Response The expected shape of the aggregation result.
   * @param pipeline - Array of aggregation pipeline stages.
   * @param options - Optional aggregation options (e.g., `session`, `allowDiskUse`).
   * @returns The raw aggregation result array.
   *
   * @example
   * const result = await repo.aggregate([{ $match: { status: 'active' } }]);
   */
  async aggregate<Response = any>(
    pipeline: PipelineStage[],
    options: AggregateOptions = {},
  ) {
    const result = await this.model.aggregate<Response>(pipeline, options);

    return result;
  }

  /**
   * Counts documents matching the provided filter query.
   *
   * @param filterQuery - Optional MongoDB filter. Pass `undefined` or `{}` to count all.
   * @returns The total count of matching documents.
   *
   * @example
   * const total = await repo.count({ isActive: true });
   */
  async count(filterQuery?: Record<string, unknown>) {
    const count = await this.model.countDocuments(filterQuery);

    return count;
  }

  /**
   * Finds documents with pagination support.
   *
   * Defaults: `page = 1`, `limit = 10`. Use `ignoreLimit: true` to fetch all results.
   *
   * @param filterQuery - Optional MongoDB filter.
   * @param options - Pagination and query options.
   * @returns A {@link PaginatedResult} containing the current page data, total count, and page metadata.
   *
   * @example
   * const page1 = await repo.findPaginated({ status: 'active' }, { page: 1, limit: 20 });
   */
  async findPaginated(
    filterQuery?: Record<string, unknown>,
    options?: FindPaginatedOptions,
  ): Promise<PaginatedResult<T>> {
    options = options || {};
    options.page = options.page || 1;
    options.limit = options.limit || 10;

    if (options.ignoreLimit && options.limit) {
      delete options.limit;
    }

    const skip =
      options?.limit && options?.page ? (options.page - 1) * options.limit : 0;

    const data = await this.model.find(filterQuery, undefined, {
      ...options,
      skip,
    });

    const totalCount = await this.model.countDocuments(filterQuery);

    const response = new PaginatedResult<T>(
      data,
      totalCount,
      options?.page,
      options?.limit,
    );

    return response;
  }

  /**
   * Finds the first document matching the filter and deletes it permanently.
   *
   * @param filterQuery - MongoDB filter to locate the document.
   * @param options - Optional options, such as a transaction session.
   * @returns The deleted document, or `null` if not found.
   *
   * @example
   * const deleted = await repo.findOneAndDelete({ token: 'abc123' });
   */
  async findOneAndDelete(
    filterQuery?: Record<string, unknown>,
    options?: FindOneAndDeleteOptions,
  ) {
    const document = await this.model.findOneAndDelete(filterQuery, {
      session: options?.session,
    });

    return document;
  }

  /**
   * Updates multiple documents matching the filter query.
   *
   * Runs schema validators by default (`runValidators: true`).
   *
   * @param filterQuery - MongoDB filter to identify documents to update.
   * @param updateQuery - The MongoDB update operations.
   * @param options - Optional options, such as a transaction session.
   * @returns The Mongoose `UpdateResult` containing `matchedCount`, `modifiedCount`, etc.
   *
   * @example
   * const result = await repo.updateMany({ isActive: false }, { $set: { isActive: true } });
   */
  async updateMany(
    filterQuery: Record<string, unknown>,
    updateQuery: UpdateQuery<HydratedDocument<T>>,
    options?: UpdateManyOptions,
  ) {
    const result = await this.model.updateMany(filterQuery, updateQuery, {
      session: options?.session,
      runValidators: true,
    });

    return result;
  }

  /**
   * Deletes multiple documents matching the filter query.
   *
   * @param filterQuery - MongoDB filter to identify documents to delete.
   * @param options - Optional options, such as a transaction session.
   * @returns An object containing `deletedCount`.
   *
   * @example
   * const result = await repo.deleteMany({ isDeleted: true });
   */
  async deleteMany(
    filterQuery: Record<string, unknown>,
    options?: DeleteManyOptions,
  ): Promise<{ deletedCount: number }> {
    const result = await this.model.deleteMany(filterQuery, {
      session: options?.session,
    });

    return result;
  }

  /**
   * Executes a paginated aggregation pipeline.
   *
   * Automatically appends `$skip` and `$limit` stages for pagination.
   * Also runs a counter pipeline to compute `totalCount` and `pageCount`.
   *
   * @template Response The expected shape of the aggregation result.
   * @param pipeline - Base aggregation pipeline stages.
   * @param options - Pagination and aggregation options.
   * @returns A {@link PaginatedResult} containing the aggregated data and pagination metadata.
   *
   * @example
   * const result = await repo.paginatedAggregation<SalesSummary>(
   *   [{ $group: { _id: '$region', total: { $sum: '$amount' } } }],
   *   { page: 1, limit: 10 }
   * );
   */
  async paginatedAggregation<Response = any>(
    pipeline: PipelineStage[],
    options?: PaginatedAggregationOptions,
  ): Promise<PaginatedResult<Response>> {
    if (options?.ignoreLimit && options?.limit) {
      const optionsWithoutLimit = { ...options };
      delete optionsWithoutLimit.limit;
      options = optionsWithoutLimit;
    }

    const skip = options?.ignoreLimit
      ? undefined
      : options?.page && options?.limit
        ? (options.page - 1) * options.limit
        : undefined;

    const limit = options?.ignoreLimit ? undefined : options?.limit;

    const paginatedPipeline = [
      ...pipeline,
      ...(skip ? [{ $skip: skip }] : []),
      ...(limit ? [{ $limit: limit }] : []),
    ];

    const counterPipeline = [
      ...pipeline,
      { $group: { _id: null, count: { $sum: 1 } } },
    ];

    const [documents, counter] = await Promise.all([
      this.aggregate<Response>(paginatedPipeline, {
        session: options?.session,
      }),
      this.aggregate<{ _id: null; count: number }>(counterPipeline, {
        session: options?.session,
      }),
    ]);

    const totalCount = counter[0] ? counter[0].count : 0;

    const response = new PaginatedResult<Response>(
      documents,
      totalCount,
      options?.page,
      options?.limit,
    );

    return response;
  }
}
