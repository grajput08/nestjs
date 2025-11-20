import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import {
  ROUTE_INFO_METADATA_KEY,
  RouteInfoOptions,
} from '../decorators/route-info.decorator';
import { Request } from 'express';

@Injectable()
export class RouteInfoInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RouteInfoInterceptor.name);

  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const routeInfo = this.reflector.getAllAndOverride<RouteInfoOptions>(
      ROUTE_INFO_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!routeInfo) {
      return next.handle();
    }

    const now = Date.now();
    const req = context.switchToHttp().getRequest<Request>();

    const path = req?.originalUrl ?? req?.url ?? 'unknown';
    this.logger.debug(
      `[${routeInfo.version ?? 'v1'}] ${routeInfo.summary} :: ${req.method} ${path}`,
    );

    return next.handle().pipe(
      tap(() => {
        const elapsed = Date.now() - now;
        this.logger.debug(
          `[${routeInfo.version ?? 'v1'}] ${routeInfo.summary} completed in ${elapsed}ms`,
        );
      }),
    );
  }
}
