import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { RouteInfoInterceptor } from '../interceptors/route-info.interceptor';

export const ROUTE_INFO_METADATA_KEY = 'route:info';

export type RouteInfoOptions = {
  summary: string;
  version?: string;
  public?: boolean;
};

export const RouteInfo = (options: RouteInfoOptions): MethodDecorator => {
  return applyDecorators(
    SetMetadata(ROUTE_INFO_METADATA_KEY, options),
    UseInterceptors(RouteInfoInterceptor),
  );
};
