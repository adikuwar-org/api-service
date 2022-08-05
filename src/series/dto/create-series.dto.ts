import { IsNotEmpty } from 'class-validator';

export class CreateSeriesDto {
  @IsNotEmpty()
  readonly name: string;
}
