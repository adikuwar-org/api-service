import { SeriesDocument } from '../schemas/series.schema';

export class Series {
  /**
   * Name of the Series
   * @example 'World Cup'
   */
  readonly name: string;

  /**
   * Id of the Series
   * @example 62ed1c0022738d3d35b23712
   */
  readonly id: string;
  constructor(series: SeriesDocument) {
    this.name = series.name;
    this.id = series._id;
  }
}
