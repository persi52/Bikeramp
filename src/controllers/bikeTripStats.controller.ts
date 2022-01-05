import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateTripDto } from "src/dto/createTrip.dto";
import { BikeTrip } from "src/entities/bikeTrip.entity";
import { BikeTripService } from "src/services/bikeTrip.service";

@Controller('api/stats')
export class BikeTripStatsController{

    constructor(private readonly bikeTripService : BikeTripService){}


    @Get('/weekly')
    getWeeklyStats(){
        return this.bikeTripService.getWeeklyStats();
    }

    @Get('/monthly')
    getMonthlyStats(){
        return this.bikeTripService.getMonthlyStats();
    }
}