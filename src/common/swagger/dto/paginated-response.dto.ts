import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({
    description:
      'Total number of documents matching the query across all pages.',
    example: 150,
  })
  totalCount!: number;

  @ApiProperty({
    description: 'Current page number (1-based), or `null` if not paginated.',
    example: 1,
    nullable: true,
  })
  page!: number | null;

  @ApiProperty({
    description: 'Number of documents per page, or `null` if not paginated.',
    example: 10,
    nullable: true,
  })
  limit!: number | null;

  @ApiProperty({
    description: 'Total number of pages calculated from totalCount and limit.',
    example: 15,
  })
  pageCount!: number;
}

export class PaginatedResponseDto<T = unknown> {
  @ApiProperty({
    description: 'Array of returned items for the current page.',
    type: [Object],
  })
  data!: T[];

  @ApiProperty({
    type: () => PaginationMetaDto,
    description: 'Pagination metadata.',
  })
  meta!: PaginationMetaDto;
}
