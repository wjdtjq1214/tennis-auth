import { LoggerMiddleware } from './logger.middleware';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '@nestjs/common';

describe('LoggerMiddleware', () => {
  let loggerMiddleware: LoggerMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNextFunction: NextFunction;

  beforeEach(() => {
    loggerMiddleware = new LoggerMiddleware();

    mockRequest = {
      method: 'GET',
      originalUrl: '/test-url',
    };

    mockResponse = {
      on: jest.fn((event: string, callback: () => void) => {
        if (event === 'finish') {
          callback();
        }
        return mockResponse as Response; // Ensure the return type matches Response
      }),
      statusCode: 200,
    };

    mockNextFunction = jest.fn();
    jest.spyOn(Logger, 'log').mockImplementation(); // Mock Logger.log to prevent actual logging
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log the request details when the response finishes', () => {
    const startTime = Date.now();
    jest
      .spyOn(Date, 'now')
      .mockImplementationOnce(() => startTime)
      .mockImplementationOnce(() => startTime + 100);

    loggerMiddleware.use(
      mockRequest as Request,
      mockResponse as Response,
      mockNextFunction,
    );

    expect(mockResponse.on).toHaveBeenCalledWith(
      'finish',
      expect.any(Function),
    );
    expect(mockNextFunction).toHaveBeenCalled();

    // Simulate the 'finish' event
    (mockResponse.on as jest.Mock).mock.calls[0][1]();

    expect(Logger.log).toHaveBeenCalledWith('[GET] /test-url - 200 - 100ms');
  });

  it('should call next function', () => {
    loggerMiddleware.use(
      mockRequest as Request,
      mockResponse as Response,
      mockNextFunction,
    );

    expect(mockNextFunction).toHaveBeenCalled();
  });
});
