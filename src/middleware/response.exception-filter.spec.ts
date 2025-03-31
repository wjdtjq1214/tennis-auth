import { ResponseExceptionFilter } from './response.exception-filter';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ApiResponseDto } from './dto/response.dto';

describe('ResponseExceptionFilter', () => {
  let exceptionFilter: ResponseExceptionFilter;

  beforeEach(() => {
    exceptionFilter = new ResponseExceptionFilter();
  });

  it('should handle HttpException and return a formatted response', () => {
    // Mock the exception
    const mockException = new HttpException('Test error message', HttpStatus.BAD_REQUEST);

    // Mock the ArgumentsHost
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as unknown as ArgumentsHost;

    // Call the catch method
    exceptionFilter.catch(mockException, mockArgumentsHost);

    // Assertions
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      new ApiResponseDto(HttpStatus.BAD_REQUEST, false, 'Test error message'),
    );
  });
});