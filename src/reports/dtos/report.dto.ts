import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: string;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  mileage: number;

  @Expose()
  price: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  //   @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;

  @Expose()
  approved: boolean;
}
