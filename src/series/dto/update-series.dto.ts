import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSeries {
  /**
   * Name of the Series
   * @example 'World Cup'
   */
  @IsNotEmpty()
  @IsString()
  readonly name?: string;
}
