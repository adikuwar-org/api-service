import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSeriesDto {
  /**
   * Name of the Series
   * @example 'World Cup'
   */
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
