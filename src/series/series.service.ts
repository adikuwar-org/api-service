import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { Series, SeriesDocument } from './schemas/series.schema';

@Injectable()
export class SeriesService {
  private readonly logger = new Logger(SeriesService.name);

  constructor(
    @InjectModel(Series.name) private seriesModel: Model<SeriesDocument>,
  ) {}

  async create(createSeriesDto: CreateSeriesDto): Promise<SeriesDocument> {
    this.logger.log('Creating series');
    this.logger.verbose('Creating series', createSeriesDto);
    const createdSeries = new this.seriesModel(createSeriesDto);
    return createdSeries.save();
  }

  async findAll(): Promise<SeriesDocument[]> {
    this.logger.log(`Fetching series`);
    return this.seriesModel.find().exec();
  }

  async findOne(id: string): Promise<SeriesDocument> {
    this.logger.debug(`Fetching series with id : ${id}`);
    return this.seriesModel.findById(id).exec();
  }

  async update(
    id: string,
    updateSeriesDto: UpdateSeriesDto,
  ): Promise<SeriesDocument> {
    this.logger.debug(`Updating series with id : ${id}`);
    this.logger.verbose(
      `Updating series with id : ${id} and data`,
      updateSeriesDto,
    );
    return this.seriesModel.findByIdAndUpdate(id, updateSeriesDto).exec();
  }

  async remove(id: string): Promise<SeriesDocument> {
    this.logger.debug(`Removing series with id : ${id}`);
    return this.seriesModel.findByIdAndDelete(id).exec();
  }
}
