export class ApiResponseDto<T> {
  constructor(
    public code: number,
    public success: boolean,
    public data: T,
  ) {}
}
