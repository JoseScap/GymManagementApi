export type PaginatedApiResponse<T> = {
  first: number,
  prev: number | null,
  next: number | null,
  last: number,
  pages: number,
  items: number,
  data: T[]
}

export type SingleApiResponse<T> = {
  data: T
}