import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSeriesDto {
  /**
   * Name of the Series
   * @example 'World Cup'
   */
  @IsNotEmpty()
  @IsString()
  readonly name?: string;
}
