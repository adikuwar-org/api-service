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
} from '@nestjs/common';
import { SeriesService } from './series.service';
import { CreateSeriesDto } from './dto/create-series.dto';
import { UpdateSeriesDto } from './dto/update-series.dto';
import { SeriesResponseDto } from './dto/series-response.dto';

@Controller('series')
export class SeriesController {
  private readonly logger = new Logger(SeriesController.name);
  constructor(private readonly seriesService: SeriesService) {}

  @Post()
  async create(@Body() createSeriesDto: CreateSeriesDto) {
    // Verify name uniqueness
    const seriesName: string = createSeriesDto.name;
    this.logger.debug(
      `Verifying series with name : ${seriesName} do not exsit`,
    );
    const series = await this.seriesService.findOneWithName(seriesName);

    if (series) {
      this.logger.error(`Series with name : ${seriesName} already exist`);
      throw new HttpException(
        `Series with name '${seriesName}' already exist`,
        HttpStatus.BAD_REQUEST,
      );
    } else {
      this.logger.debug(`Series name : ${seriesName} is unique`);
    }

    this.logger.log('Creating series');
    this.logger.verbose('Creating series : ', createSeriesDto);
    const createdSeries = await this.seriesService.create(createSeriesDto);
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
    const series = await this.seriesService.findOne(id);

    // check if series exist
    if (series) {
      this.logger.debug(`Fetched series with id : ${id}`);
      return new SeriesResponseDto(series);
    } else {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSeriesDto: UpdateSeriesDto,
  ) {
    this.logger.debug(`Updating series with id : ${id}`);

    // if name is to be updated verify that series with given name do not exist
    const seriesName = updateSeriesDto.name;
    if (seriesName) {
      this.logger.debug(`Verifying series name '${seriesName} is unique`);
      const series = await this.seriesService.findOneWithName(seriesName);
      if (series && id !== series.id) {
        // series with given name already exist
        this.logger.error(`Series with name : ${seriesName} already exist`);
        throw new HttpException(
          `Series with name '${seriesName}' already exist`,
          HttpStatus.BAD_REQUEST,
        );
      } else {
        this.logger.debug(`Series name '$SeriesName} is unique`);
      }
    } else {
      this.logger.log(`Series name is not provided for update`);
    }

    this.logger.verbose(
      `Updating series with id : ${id} with data`,
      updateSeriesDto,
    );
    await this.seriesService.update(id, updateSeriesDto);
    this.logger.debug(`Updated series with id : ${id}`);
    this.logger.debug(`Fetching updated series with id : ${id}`);
    const updatedSeries = await this.seriesService.findOne(id);
    this.logger.debug(`Fetched updated series with id : ${id}`);
    this.logger.verbose(
      `Updated series with id : ${id}`,
      updatedSeries.toObject(),
    );
    return new SeriesResponseDto(updatedSeries);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.debug(`Deleting series with id : ${id}`);
    const deletedSeries = await this.seriesService.remove(id);
    if (deletedSeries) {
      this.logger.debug(`Deleted series with id : ${id}`);
    } else {
      this.logger.debug(`Series with id : $${id} do not exist`);
    }
  }
}
