import { CurrentUser } from './../users/decorators/current-user.decorator';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptors';
import { ReportDto } from './dtos/report.dto';
import { ApprovedReportDto } from './dtos/approved-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

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
    return this.reportsService.create(user, reportDto);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  async changeApproval(
    @Param('id') id: string,
    @Body() body: ApprovedReportDto,
  ) {
    console.log('ID', id);
    return this.reportsService.changeApproval(id, body.approved);
  }

  @Get()
  async getEstimate(@Query() estimateDto: GetEstimateDto) {
    return this.reportsService.getEstimate(estimateDto);
  }
}
