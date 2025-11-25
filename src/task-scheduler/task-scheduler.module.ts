import { Module } from '@nestjs/common';
import { ReportsModule } from '../reports/reports.module';
import { TaskSchedulerService } from './task-scheduler.service';

@Module({
  imports: [ReportsModule],
  providers: [TaskSchedulerService],
})
export class TaskSchedulerModule {}
