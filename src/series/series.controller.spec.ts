import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import { SeriesController } from './series.controller';
import { SeriesService, SeriesErrors } from './series.service';

describe('SeriesController', () => {
  let controller: SeriesController;
  const existingSeries = [
    {
      name: 'Series 1',
      _id: '62ee91648e835835481d53fa',
    },
    {
      name: 'Series 2',
      _id: '62ee91648e835835481d53fb',
    },
    {
      name: 'Series 3',
      _id: '62ee91648e835835481d53fc',
    },
  ];

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
                _id: '62ee91648e835835481d53fa',
                toObject: () => {
                  return {
                    name: series.name,
                    _id: '62ee91648e835835481d53fa',
                  };
                },
              });
            }),
            findAll: jest.fn().mockResolvedValue(existingSeries),
            findOne: jest.fn().mockImplementation((id: string) => {
              if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error(SeriesErrors.InvalidObjectId);
              }

              const index = existingSeries.findIndex(
                (series) => series._id === id,
              );

              if (index < 0) {
                return Promise.resolve(null);
              } else {
                return Promise.resolve(existingSeries[index]);
              }
            }),
            update: jest.fn().mockImplementation((id: string, update: any) => {
              if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error(SeriesErrors.InvalidObjectId);
              }

              const index = existingSeries.findIndex(
                (series) => series._id === id,
              );

              if (index < 0) {
                throw new Error(SeriesErrors.NotFound);
              } else {
                let existingSeriesWithNameIndex = -1;
                if (update.name) {
                  existingSeriesWithNameIndex = existingSeries.findIndex(
                    (series) =>
                      series._id !== id && series.name === update.name,
                  );
                }

                if (existingSeriesWithNameIndex < 0) {
                  const updatedSeries: any = {
                    _id: id,
                  };
                  if (update.name) {
                    updatedSeries.name = update.name;
                  } else {
                    updatedSeries.name = existingSeries[index].name;
                  }
                  return Promise.resolve(updatedSeries);
                } else {
                  throw new Error(SeriesErrors.NameUniquenessError);
                }
              }
            }),
            remove: jest.fn().mockImplementation((id: string) => {
              if (mongoose.Types.ObjectId.isValid(id)) {
                const index = existingSeries.findIndex(
                  (series) => series._id === id,
                );
                if (index < 0) {
                  return Promise.resolve(null);
                } else {
                  return Promise.resolve(existingSeries[index]);
                }
              } else {
                throw new Error(SeriesErrors.InvalidObjectId);
              }
            }),
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
        id: '62ee91648e835835481d53fa',
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
          id: '62ee91648e835835481d53fa',
        },
        {
          name: 'Series 2',
          id: '62ee91648e835835481d53fb',
        },
        {
          name: 'Series 3',
          id: '62ee91648e835835481d53fc',
        },
      ];

      expect(seriesList).toEqual(expectedSeriesList);
    });
  });

  describe('SeriesController.findOne', () => {
    it('should return series', async () => {
      const series = await controller.findOne(existingSeries[0]._id);

      const expectedSeries = {
        name: existingSeries[0].name,
        id: existingSeries[0]._id,
      };

      expect(series).toEqual(expectedSeries);
    });
  });

  it('should throw error when id is invalid', async () => {
    return expect(controller.findOne('invalid')).rejects.toThrow(
      `Series id 'invalid' is invalid`,
    );
  });

  it('should throw error when series with id does not exist', async () => {
    return expect(
      controller.findOne('62ee91648e835835481d53fd'),
    ).rejects.toThrow('Not Found');
  });

  describe('SeriesController.update', () => {
    it('should update series', async () => {
      const updatedSeries = await controller.update(existingSeries[0]._id, {
        name: 'Series 4',
      });

      const expectedSeries = {
        name: 'Series 4',
        id: existingSeries[0]._id,
      };

      expect(updatedSeries).toEqual(expectedSeries);
    });

    it('should throw error if another series with name already exist', async () => {
      return expect(
        controller.update(existingSeries[0]._id, {
          name: existingSeries[1].name,
        }),
      ).rejects.toThrow(
        `Series with name '${existingSeries[1].name}' already exist`,
      );
    });

    it('should throw error if series is not found', async () => {
      return expect(
        controller.update('62ee91648e835835481d53fd', {
          name: 'Series 4',
        }),
      ).rejects.toThrow('Not Found');
    });

    it('should throw error if id is invalid', async () => {
      return expect(
        controller.update('invalid', {
          name: 'Series 4',
        }),
      ).rejects.toThrow(`Series id 'invalid' is invalid`);
    });
  });

  describe('SeriesService.remove', () => {
    it('should delete series', async () => {
      return expect(
        controller.remove(existingSeries[0]._id),
      ).resolves.toBeUndefined();
    });

    it('should throw error when id is invalid', async () => {
      return expect(controller.remove(`invalid`)).rejects.toThrow(
        `Series id 'invalid' is invalid`,
      );
    });

    it('should throw error when series with id does not exist', async () => {
      return expect(
        controller.remove('62ee91648e835835481d53fd'),
      ).rejects.toThrow('Not Found');
    });
  });
});
