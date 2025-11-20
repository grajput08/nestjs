import { Provider } from '@nestjs/common';
import { TodoService } from '../../todo/todo.service';
import { Todo } from '@prisma/client';

export type TodoSummary = {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  recent: Todo[];
};

export interface TodoStatsProvider {
  getSummary(): Promise<TodoSummary>;
}

export const TODO_STATS_PROVIDER = Symbol('TODO_STATS_PROVIDER');

export const TodoStatsProviderFactory: Provider = {
  provide: TODO_STATS_PROVIDER,
  useFactory: (todoService: TodoService): TodoStatsProvider => ({
    async getSummary(): Promise<TodoSummary> {
      const todos = await todoService.findAll();
      const completed = todos.filter((todo) => todo.completed).length;
      const total = todos.length;
      const pending = total - completed;

      return {
        total,
        completed,
        pending,
        completionRate:
          total === 0 ? 0 : Number(((completed / total) * 100).toFixed(2)),
        recent: todos.slice(0, 5),
      };
    },
  }),
  inject: [TodoService],
};
