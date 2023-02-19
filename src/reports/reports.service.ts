import { CreateReportDto } from './dtos/create-report.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private repository: Repository<Report>,
  ) {}

  create(user: User, reportDto: CreateReportDto): Promise<Report> {
    const report = this.repository.create(reportDto);
    report.user = user;

    return this.repository.save(report);
  }
}
