import { BikeTrip } from "src/entities/bikeTrip.entity";
import { BikeTripController } from "src/controllers/bikeTrip.controller";
import { BikeTripService } from "src/services/bikeTrip.service";
import {  Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BikeTripStatsController } from "src/controllers/bikeTripStats.controller";

@Module({
    imports: [TypeOrmModule.forFeature([BikeTrip])],
    controllers : [BikeTripController,BikeTripStatsController],
    providers : [BikeTripService]
})
export class BikeTripModule {}