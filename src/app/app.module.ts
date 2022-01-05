import { Module } from '@nestjs/common';
import {BikeTripController} from "../controllers/bikeTrip.controller"
import { BikeTripService } from 'src/services/bikeTrip.service';
import { BikeTripStatsController } from 'src/controllers/bikeTripStats.controller';

@Module({
  imports: [],
  controllers: [BikeTripController,BikeTripStatsController],
  providers: [BikeTripService],
})
export class AppModule {}
