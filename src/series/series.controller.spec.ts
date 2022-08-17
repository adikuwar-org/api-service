import { Test, TestingModule } from '@nestjs/testing';
import { SeriesController } from './series.controller';
import { SeriesService, SeriesErrors } from './series.service';

describe('SeriesController', () => {
  let controller: SeriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeriesController],
      providers: [
        {
          provide: SeriesService,
          useValue: {
            create: jest.fn().mockImplementation((series: any) => {
              if (series.name === 'NotUnique') {
                throw new Error(SeriesErrors.NameUniquenessError);
              }
              return Promise.resolve({
                name: series.name,
                _id: 'id',
                toObject: () => {
                  return {
                    name: series.name,
                    _id: 'id',
                  };
                },
              });
            }),
            findAll: jest.fn().mockResolvedValue([
              {
                name: 'Series 1',
                _id: 'id1',
              },
              {
                name: 'Series 2',
                _id: 'id2',
              },
              {
                name: 'Series 3',
                _id: 'id3',
              },
            ]),
          },
        },
      ],
    }).compile();

    controller = module.get<SeriesController>(SeriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('SeriesController.create', () => {
    it('should create series', async () => {
      const createdSeries = await controller.create({
        name: 'Series 1',
      });

      const expectedSeries = {
        name: 'Series 1',
        id: 'id',
      };

      expect(createdSeries).toEqual(expectedSeries);
    });

    it('should throw error if name is not unique', async () => {
      expect(
        controller.create({
          name: 'NotUnique',
        }),
      ).rejects.toThrow(`Series with name 'NotUnique' already exist`);
    });
  });

  describe('SeriesController.findAll', () => {
    it('should return all series', async () => {
      const seriesList = await controller.findAll();

      const expectedSeriesList = [
        {
          name: 'Series 1',
          id: 'id1',
        },
        {
          name: 'Series 2',
          id: 'id2',
        },
        {
          name: 'Series 3',
          id: 'id3',
        },
      ];

      expect(seriesList).toEqual(expectedSeriesList);
    });
  });
});
