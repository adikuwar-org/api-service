import { SeriesDocument } from '../schemas/series.schema';

export class SeriesResponseDto {
  readonly name: string;
  readonly id: string;
  constructor(series: SeriesDocument) {
    this.name = series.name;
    this.id = series._id;
  }
}
