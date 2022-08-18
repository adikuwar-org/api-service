import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Series } from './schemas/series.schema';
import { SeriesService } from './series.service';
import * as _ from 'lodash';

describe('SeriesService', () => {
  let service: SeriesService;
  let model: Model<Series>;

  const seriesArray = [
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
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeriesService,
        {
          provide: getModelToken('Series'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SeriesService>(SeriesService);
    model = module.get<Model<Series>>(getModelToken('Series'));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('SeriesService.create', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should create series', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      jest.spyOn(model, 'create').mockImplementationOnce((series: any) => {
        series._id = 'id4';
        return Promise.resolve(series);
      });
      const series = {
        name: 'Series 4',
      };
      const createdSeries = await service.create(_.cloneDeep(series));
      const expectedSeries = {
        name: 'Series 4',
        _id: 'id4',
      };
      expect(createdSeries).toEqual(expectedSeries);
    });

    it('should return error if series name is not unique', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce({
          name: 'Series 1',
          _id: 'id1',
        }),
      } as any);
      const series = {
        name: 'Series 1',
      };

      return expect(service.create(series)).rejects.toThrow(
        'NAME_UNIQUENESS_ERROR',
      );
    });
  });

  describe('SeriesService.findAll', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return all series', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(_.cloneDeep(seriesArray)),
      } as any);
      const series = await service.findAll();
      expect(series).toEqual(seriesArray);
    });
  });

  describe('SeriesService.findOne', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return series', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce({
          name: 'Series 1',
          _id: '62ee91648e835835481d53fa',
        }),
      } as any);

      const actualSeries = await service.findOne('62ee91648e835835481d53fa');
      const expectedSeries = {
        name: 'Series 1',
        _id: '62ee91648e835835481d53fa',
      };
      expect(actualSeries).toEqual(expectedSeries);
    });

    it('should throw error if id is invalid', async () => {
      expect(service.findOne('invalid')).rejects.toThrow('INVALID_OBJECT_ID');
    });
  });

  describe('SeriesService.update', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should update the series', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce({
          name: 'Series 1',
          _id: '62ee91648e835835481d53fa',
        }),
      } as any);

      jest.spyOn(model, 'findOne').mockReturnValue({
        where: jest.fn().mockReturnValue({
          equals: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              ne: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce(null),
              }),
            }),
          }),
        }),
      } as any);

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce({
          name: 'Updated Series',
          _id: '62ee91648e835835481d53fa',
        }),
      } as any);

      const update = {
        name: 'Updated Series',
      };

      const updatedSeries = await service.update(
        '62ee91648e835835481d53fa',
        update,
      );

      const expectedSeries = {
        name: 'Updated Series',
        _id: '62ee91648e835835481d53fa',
      };

      expect(updatedSeries).toEqual(expectedSeries);
    });

    it('should return error when series id is invalid', async () => {
      const update = {
        name: 'Updated Series',
      };

      expect(service.update('invalid', update)).rejects.toThrow(
        'INVALID_OBJECT_ID',
      );
    });

    it('should return error when series with id does not exist', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      const update = {
        name: 'Updated Series',
      };

      expect(
        service.update('62ee91648e835835481d53fa', update),
      ).rejects.toThrow('NOT_FOUND');
    });

    it('should return error when series with name already exist', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce({
          name: 'Series 1',
          _id: '62ee91648e835835481d53fa',
        }),
      } as any);

      jest.spyOn(model, 'findOne').mockReturnValue({
        where: jest.fn().mockReturnValue({
          equals: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              ne: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce({
                  name: 'Series 2',
                  _id: '62ee91648e835835481d53fb',
                }),
              }),
            }),
          }),
        }),
      } as any);

      const update = {
        name: 'Series 2',
      };

      expect(
        service.update('62ee91648e835835481d53fa', update),
      ).rejects.toThrow('NAME_UNIQUENESS_ERROR');
    });

    it('should update series if name is not provided', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce({
          name: 'Series 1',
          _id: '62ee91648e835835481d53fa',
        }),
      } as any);

      jest.spyOn(model, 'findOne').mockReturnValue({
        where: jest.fn().mockReturnValue({
          equals: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              ne: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValueOnce(null),
              }),
            }),
          }),
        }),
      } as any);

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce({
          name: 'Updated Series',
          _id: '62ee91648e835835481d53fa',
        }),
      } as any);

      const update = {};

      const updatedSeries = await service.update(
        '62ee91648e835835481d53fa',
        update,
      );

      const expectedSeries = {
        name: 'Updated Series',
        _id: '62ee91648e835835481d53fa',
      };

      expect(updatedSeries).toEqual(expectedSeries);
    });
  });

  describe('SeriesService.remove', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should delete series', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      const deletedSeries = await service.remove('62ee91648e835835481d53fa');
      expect(deletedSeries).toBeNull();
    });

    it('should return error if id is invalid', async () => {
      expect(service.remove('invalid')).rejects.toThrow('INVALID_OBJECT_ID');
    });
  });
});
