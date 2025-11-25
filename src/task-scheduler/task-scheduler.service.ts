import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReportsService } from '../reports/reports.service';

@Injectable()
export class TaskSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(TaskSchedulerService.name);

  constructor(private readonly reportsService: ReportsService) {}

  onModuleInit() {
    this.logger.log('Task scheduler initialized - cron jobs are active');
    this.logger.log('Scheduled task "logTodoSummary" will run every minute');
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async logTodoSummary(): Promise<void> {
    this.logger.debug('Executing scheduled task: logTodoSummary');
    try {
      const summary = await this.reportsService.getTodoSummary();
      this.logger.log(
        `[SCHEDULED TASK] Todo Summary - total=${summary.total} completed=${summary.completed} pending=${summary.pending} completionRate=${summary.completionRate}%`,
      );
    } catch (error) {
      const message = 'Failed to refresh scheduled todo summary metrics';
      if (error instanceof Error) {
        this.logger.error(message, error.stack);
        return;
      }
      this.logger.error(message);
    }
  }
}
