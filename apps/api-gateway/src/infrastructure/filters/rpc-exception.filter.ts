import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

interface RpcError {
    statusCode?: number;
    message?: string;
    error?: string;
}

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'Error';

        if (exception instanceof RpcException) {
            const rpcError = exception.getError() as RpcError | string;

            if (typeof rpcError === 'string') {
                message = rpcError;
            } else if (typeof rpcError === 'object') {
                statusCode = rpcError.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
                message = rpcError.message || message;
                error = rpcError.error || this.getErrorName(statusCode);
            }
        } else if (exception instanceof Error) {
            // Handle standard errors (may come wrapped from Kafka)
            const errorMessage = exception.message;

            // Try to parse if it's a JSON string from RpcException
            try {
                const parsed = JSON.parse(errorMessage) as RpcError;
                statusCode = parsed.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
                message = parsed.message || errorMessage;
                error = parsed.error || this.getErrorName(statusCode);
            } catch {
                // Not JSON, use raw message
                message = errorMessage;
            }
        }

        console.log(`🔴 [Gateway] Error ${statusCode}: ${message}`);

        response.status(statusCode).json({
            statusCode,
            message,
            error,
            timestamp: new Date().toISOString(),
        });
    }

    private getErrorName(statusCode: number): string {
        switch (statusCode) {
            case 400:
                return 'Bad Request';
            case 401:
                return 'Unauthorized';
            case 403:
                return 'Forbidden';
            case 404:
                return 'Not Found';
            case 409:
                return 'Conflict';
            case 422:
                return 'Unprocessable Entity';
            default:
                return 'Error';
        }
    }
}
