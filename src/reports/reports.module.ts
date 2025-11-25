import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { TodoModule } from '../todo/todo.module';
import { AuthModule } from '../auth/auth.module';
import { TodoStatsProviderFactory } from './providers/todo-stats.provider';
import { RouteInfoInterceptor } from '../common/interceptors/route-info.interceptor';

@Module({
  imports: [TodoModule, AuthModule],
  controllers: [ReportsController],
  providers: [ReportsService, TodoStatsProviderFactory, RouteInfoInterceptor],
  exports: [ReportsService],
})
export class ReportsModule {}
