import { Module } from '@nestjs/common';
import {BikeTripController} from "../controllers/bikeTrip.controller"
import { BikeTripService } from 'src/services/bikeTrip.service';
import { BikeTripStatsController } from 'src/controllers/bikeTripStats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BikeTrip } from 'src/entities/bikeTrip.entity';
import { ConfigModule } from '@nestjs/config';
import { BikeTripModule } from './bikeTrip.module';

@Module({
  imports: [     
    ConfigModule.forRoot({isGlobal : true}),
    TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(<string>process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    autoLoadEntities: true,
    synchronize: true,
  }),
  BikeTripModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
