import { ApiResponseInterceptor } from './response.interceptor';
import { CallHandler, ExecutionContext, HttpStatus } from '@nestjs/common';
import { of } from 'rxjs';
import { ApiResponseDto } from './dto/response.dto';

describe('ApiResponseInterceptor', () => {
  let interceptor: ApiResponseInterceptor;

  beforeEach(() => {
    interceptor = new ApiResponseInterceptor();
  });

  it('should wrap the response in an ApiResponseDto', (done) => {
    const mockExecutionContext = {} as ExecutionContext;
    const mockCallHandler: CallHandler = {
      handle: jest.fn(() => of({ key: 'value' })),
    };

    interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .subscribe((result) => {
        expect(result).toEqual(
          new ApiResponseDto(HttpStatus.OK, true, { key: 'value' }),
        );
        done();
      });

    expect(mockCallHandler.handle).toHaveBeenCalled();
  });
});
