import { Inject, Injectable } from '@nestjs/common';
import { TODO_STATS_PROVIDER } from './providers/todo-stats.provider';
import type {
  TodoStatsProvider,
  TodoSummary,
} from './providers/todo-stats.provider';

@Injectable()
export class ReportsService {
  constructor(
    @Inject(TODO_STATS_PROVIDER)
    private readonly todoStatsProvider: TodoStatsProvider,
  ) {}

  getTodoSummary(): Promise<TodoSummary> {
    return this.todoStatsProvider.getSummary();
  }
}
