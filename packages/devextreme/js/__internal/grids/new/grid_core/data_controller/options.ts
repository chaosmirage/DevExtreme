import type { DataSourceLike } from '@js/data/data_source';

interface PagingOptions {
  pageSize?: number;

  pageIndex?: number;
}

export interface Options {
  paging?: PagingOptions;

  dataSource?: DataSourceLike<unknown>;

  keyExpr?: string | string[];
}

export const defaultOptions = {
  paging: {
    pageSize: 6,
    pageIndex: 0,
  },
} satisfies Options;
