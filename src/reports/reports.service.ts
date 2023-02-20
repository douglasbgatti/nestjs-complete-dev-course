import { CreateReportDto } from './dtos/create-report.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

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

  async changeApproval(id: string, approved: boolean): Promise<Report> {
    const report = await this.repository.findOneBy({ id });

    if (!report) {
      throw new NotFoundException(`User ${id} does not exist`);
    }

    report.approved = approved;

    return this.repository.save(report);
  }

  async getEstimate(estimateDto: GetEstimateDto) {
    const { make, model, lat, lng, year, mileage } = estimateDto;
    return this.repository
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3) // top 3 reports
      .getRawOne();
  }
}
