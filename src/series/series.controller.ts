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
  UseGuards,
} from '@nestjs/common';
import { SeriesService, SeriesErrors } from './series.service';
import { CreateSeries } from './dto/create-series.dto';
import { UpdateSeries } from './dto/update-series.dto';
import { Series } from './entities/series.entity';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';
import { CheckPolicies } from 'src/casl/decorators/check-policies';
import { CreateSeriesPolicyHandler } from './policies/create-series-policy.handler';
import { ReadSeriesPolicyHandler } from './policies/read-series-policy.handler';
import { UpdateSeriesPolicyHandler } from './policies/update-series-policy.handler';
import { DeleteSeriesPolicyHandler } from './policies/delete-series-policy.handler';

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

@ApiTags('series')
@ApiBearerAuth()
@Controller('series')
export class SeriesController {
  private readonly logger = new Logger(SeriesController.name);

  constructor(private readonly seriesService: SeriesService) {}

  /**
   * Creates Series
   * @param createSeriesDto Request Body to create series
   * @returns created Series
   */
  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CreateSeriesPolicyHandler())
  async create(@Body() createSeriesDto: CreateSeries): Promise<Series> {
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
    return new Series(createdSeries);
  }

  /**
   * Fetches list of series
   * @returns list of series
   */
  @Get()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadSeriesPolicyHandler())
  async findAll(): Promise<Series[]> {
    this.logger.log('Fetching series');
    const seriesList = await this.seriesService.findAll();
    this.logger.debug(`Fetched ${seriesList.length} series`);
    return seriesList.map((series) => new Series(series));
  }

  /**
   * Fetches Series specified by ID
   * @param id of the series to be fetched
   * @returns series for the specified id
   */
  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ReadSeriesPolicyHandler())
  @ApiParam({
    name: 'id',
    description: 'Id of the series to be fetched',
    example: '62ed1c0022738d3d35b23712',
  })
  async findOne(@Param('id') id: string): Promise<Series> {
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
      return new Series(series);
    } else {
      throw new NotFoundException();
    }
  }

  /**
   * Updates properties of a Series
   * @param id Id of the series to be updated
   * @param updateSeriesDto Body of the request
   * @returns updated series
   */
  @Patch(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new UpdateSeriesPolicyHandler())
  @ApiParam({
    name: 'id',
    description: 'Id of the series to be updated',
    example: '62ed1c0022738d3d35b23712',
  })
  async update(
    @Param('id') id: string,
    @Body() updateSeriesDto: UpdateSeries,
  ): Promise<Series> {
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
    return new Series(updatedSeries);
  }

  /**
   * Deletes a series
   * @param id Id of the series to be deleted
   */
  @ApiParam({
    name: 'id',
    description: 'Id of the series to be deleted',
    example: '62ed1c0022738d3d35b23712',
  })
  @Delete(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new DeleteSeriesPolicyHandler())
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
