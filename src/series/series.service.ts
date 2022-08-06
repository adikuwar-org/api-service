import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateSeries } from './dto/create-series.dto';
import { UpdateSeries } from './dto/update-series.dto';
import { Series, SeriesDocument } from './schemas/series.schema';

export enum SeriesErrors {
  NameUniquenessError = 'NAME_UNIQUENESS_ERROR',
  NotFound = 'NOT_FOUND',
  InvalidObjectId = 'INVALID_OBJECT_ID',
}

@Injectable()
export class SeriesService {
  private readonly logger = new Logger(SeriesService.name);

  constructor(
    @InjectModel(Series.name) private seriesModel: Model<SeriesDocument>,
  ) {}

  private isValidObjectId(objectId: string): boolean {
    return mongoose.Types.ObjectId.isValid(objectId);
  }

  async create(createSeriesDto: CreateSeries): Promise<SeriesDocument> {
    this.logger.log('Creating series');
    // Verify name uniqueness
    const seriesName: string = createSeriesDto.name;
    this.logger.debug(
      `Verifying series with name : ${seriesName} do not exsit`,
    );
    const existingSeries = await this.seriesModel
      .findOne({
        name: seriesName,
      })
      .exec();

    if (existingSeries) {
      this.logger.error(`Series with name : ${seriesName} already exist`);
      throw new Error(SeriesErrors.NameUniquenessError);
    } else {
      this.logger.debug(`Series name : ${seriesName} is unique`);
    }

    // create series
    this.logger.verbose('Creating series : ', createSeriesDto);
    const createdSeries = new this.seriesModel(createSeriesDto);
    return createdSeries.save();
  }

  async findAll(): Promise<SeriesDocument[]> {
    this.logger.log(`Fetching series`);
    return this.seriesModel.find().exec();
  }

  async findOne(id: string): Promise<SeriesDocument> {
    this.logger.debug(`Validating id : ${id} is valid`);
    if (this.isValidObjectId(id)) {
      this.logger.debug(`Series Id : ${id} is valid`);
    } else {
      this.logger.error(`Series Id ${id} is invalid`);
      throw new Error(SeriesErrors.InvalidObjectId);
    }
    this.logger.debug(`Fetching series with id : ${id}`);
    return this.seriesModel.findById(id).exec();
  }

  async update(
    id: string,
    updateSeriesDto: UpdateSeries,
  ): Promise<SeriesDocument> {
    this.logger.debug(`Updating series with id : ${id}`);
    // verify series exists

    // verify id is valid ObjectId
    if (this.isValidObjectId(id)) {
      this.logger.debug(`Series id : ${id} is valid`);
    } else {
      this.logger.error(`Series id : ${id} is not valid`);
      throw new Error(SeriesErrors.InvalidObjectId);
    }

    this.logger.debug(`Verifying series with id : ${id} exists`);

    const existingSeries = await this.seriesModel.findById(id).exec();

    if (existingSeries) {
      this.logger.debug(`Series with id : ${id} exists`);
    } else {
      this.logger.error(`Series with id : ${id} do not exist`);
      throw new Error(SeriesErrors.NotFound);
    }

    // if name is to be updated verify that series with given name do not exist
    const seriesName = updateSeriesDto.name;

    if (seriesName) {
      this.logger.debug(`Verifying series name '${seriesName} is unique`);
      const seriesWithSameName = await this.seriesModel
        .findOne()
        .where('name')
        .equals(seriesName)
        .where('_id')
        .ne(id)
        .exec();

      if (seriesWithSameName) {
        // series with given name already exist
        this.logger.error(`Series with name : ${seriesName} already exist`);
        throw new Error(SeriesErrors.NameUniquenessError);
      } else {
        this.logger.debug(`Series name '$SeriesName} is unique`);
      }
    } else {
      this.logger.log(`Series name is not provided for update`);
    }
    this.logger.verbose(
      `Updating series with id : ${id} and data`,
      updateSeriesDto,
    );
    return await this.seriesModel
      .findByIdAndUpdate(id, updateSeriesDto, {
        new: true,
      })
      .exec();
  }

  async remove(id: string): Promise<SeriesDocument> {
    // verify series id is valid
    if (this.isValidObjectId(id)) {
      this.logger.debug(`Series id : ${id} is valid`);
    } else {
      this.logger.error(`Series id : ${id} is invalid`);
      throw new Error(SeriesErrors.InvalidObjectId);
    }
    this.logger.debug(`Removing series with id : ${id}`);
    return this.seriesModel.findByIdAndDelete(id).exec();
  }
}
