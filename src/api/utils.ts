export const baseUrl = "http://127.0.0.1:9915";

export type PageQuery = {
  /**
   * 当前页数
   */
  currentPage: number;

  /**
   * 分页大小
   */
  pageSize: number;

  /**
   * 查询条件
   */
  query: any;
};

export type Page = {
  records: [any];
  total: number;
  size: number;
  current: number;
  maxLimit: number;
};

export type Result<T> = {
  code: number;
  message: string;
  data: T;
};
