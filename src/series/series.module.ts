import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SeriesController } from './series.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Series, SeriesSchema } from './schemas/series.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Series.name,
        schema: SeriesSchema,
      },
    ]),
    CaslModule,
  ],
  controllers: [SeriesController],
  providers: [SeriesService],
})
export class SeriesModule {}
