import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  HttpStatus,
  HttpException,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { SeriesService, SeriesErrors } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { SeriesResponseDto } from './dto/series-response.dto';

class SeriesNameUniquenessException extends HttpException {
  constructor(seriesName) {
    super(
      `Series with name '${seriesName}' already exist`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

class SeriesInvalidIdException extends HttpException {
  constructor(id) {
    super(`Series id '${id}' is invalid`, HttpStatus.BAD_REQUEST);
  }
}

@Controller('series')
export class SeriesController {
  private readonly logger = new Logger(SeriesController.name);

  constructor(private readonly seriesService: SeriesService) {}

  @Post()
  async create(@Body() createSeriesDto: CreateSeriesDto) {
    this.logger.log('Creating series');
    this.logger.verbose('Creating series : ', createSeriesDto);

    let createdSeries = null;
    try {
      createdSeries = await this.seriesService.create(createSeriesDto);
    } catch (error) {
      this.logger.error('Failed to create series', error);
      if (error.message === SeriesErrors.NameUniquenessError) {
        throw new SeriesNameUniquenessException(createSeriesDto.name);
      } else {
        throw error;
      }
    }

    this.logger.debug(`Series created with id : ${createdSeries.id}`);
    this.logger.verbose(`Created series`, createdSeries.toObject());
    return new SeriesResponseDto(createdSeries);
  }

  @Get()
  async findAll() {
    this.logger.log('Fetching series');
    const seriesList = await this.seriesService.findAll();
    this.logger.debug(`Fetched ${seriesList.length} series`);
    return seriesList.map((series) => new SeriesResponseDto(series));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.debug(`Fetching series with id : ${id}`);

    let series;

    try {
      series = await this.seriesService.findOne(id);
    } catch (error) {
      this.logger.error(`Failed to fatch series with id : ${id}`, error);
      switch (error.message) {
        case SeriesErrors.InvalidObjectId:
          throw new SeriesInvalidIdException(id);
        default:
          throw error;
      }
    }

    // check if series exist
    if (series) {
      this.logger.debug(`Fetched series with id : ${id}`);
      return new SeriesResponseDto(series);
    } else {
      throw new NotFoundException();
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSeriesDto: UpdateSeriesDto,
  ) {
    this.logger.debug(`Updating series with id : ${id}`);
    this.logger.verbose(
      `Updating series with id : ${id} with data`,
      updateSeriesDto,
    );

    let updatedSeries;
    try {
      updatedSeries = await this.seriesService.update(id, updateSeriesDto);
    } catch (error) {
      this.logger.error(
        'Failed to update series id : ${id} with data',
        updateSeriesDto,
      );
      this.logger.error('Due to error', error);
      switch (error.message) {
        case SeriesErrors.NameUniquenessError:
          throw new SeriesNameUniquenessException(updateSeriesDto.name);
        case SeriesErrors.NotFound:
          throw new NotFoundException();
        case SeriesErrors.InvalidObjectId:
          throw new SeriesInvalidIdException(id);
        default:
          throw error;
      }
    }
    this.logger.debug(`Updated series with id : ${id}`);
    this.logger.debug(`Fetching updated series with id : ${id}`);
    return new SeriesResponseDto(updatedSeries);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.debug(`Deleting series with id : ${id}`);
    let deletedSeries;

    try {
      deletedSeries = await this.seriesService.remove(id);
    } catch (error) {
      this.logger.error(`Failed to delete series`, error);
      switch (error.message) {
        case SeriesErrors.InvalidObjectId:
          throw new SeriesInvalidIdException(id);
        default:
          throw error;
      }
    }

    if (deletedSeries) {
      this.logger.debug(`Deleted series with id : ${id}`);
    } else {
      this.logger.error(`Series with id : ${id} do not exist`);
      throw new NotFoundException();
    }
  }
}
