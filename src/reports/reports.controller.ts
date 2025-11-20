import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RouteInfo } from '../common/decorators/route-info.decorator';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('todos/summary')
  @RouteInfo({
    summary: 'Aggregate todo statistics for dashboards',
    version: 'v1',
  })
  async getTodoSummary() {
    return this.reportsService.getTodoSummary();
  }
}
