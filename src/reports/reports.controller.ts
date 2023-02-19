import { CurrentUser } from './../users/decorators/current-user.decorator';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptors';
import { ReportDto } from './dtos/report.dto';

@Controller('reports')
@UseGuards(AuthGuard)
@Serialize(ReportDto)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  async createReport(
    @CurrentUser() user: User,
    @Body() reportDto: CreateReportDto,
  ) {
    console.log(user);
    return this.reportsService.create(user, reportDto);
  }
}
