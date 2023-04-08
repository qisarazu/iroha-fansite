export type CursorRequest = {
  cursor?: string | null;
  limit?: number;
};

export type ApiResponse<T> = {
  data?: T;
  error?: string;
};

export type CursorResponse<T> = {
  nextCursor: string | null;
  hasNext: boolean;
} & ApiResponse<T>;

export type Stringify<T> = { [P in keyof T]: string };
