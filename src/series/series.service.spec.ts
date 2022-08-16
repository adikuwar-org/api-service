import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Series } from './schemas/series.schema';
import { SeriesService } from './series.service';

describe('SeriesService', () => {
  let service: SeriesService;
  let model: Model<Series>;

  const seriesArray = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeriesService,
        {
          provide: getModelToken('Series'),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SeriesService>(SeriesService);
    model = module.get<Model<Series>>(getModelToken('Series'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all series', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(seriesArray),
    } as any);
    const series = await service.findAll();
    expect(series).toEqual(seriesArray);
  });
});
