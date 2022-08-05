import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSeriesDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
