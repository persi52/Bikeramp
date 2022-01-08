import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { CreateTripDto } from "src/dto/createTrip.dto";
import { BikeTrip } from "src/entities/bikeTrip.entity";
import { BikeTripService } from "src/services/bikeTrip.service";

@Controller('/stats')
export class BikeTripStatsController{

    constructor(private readonly bikeTripService : BikeTripService){}

    @ApiOperation({ summary: 'Get current week statistics of bike trips' })
    @Get('/weekly')
    getWeeklyStats(){
        return this.bikeTripService.getWeeklyStats();
    }

    @ApiOperation({ summary: 'Get current month\'s days statistics of bike trips' })
    @Get('/monthly')
    getMonthlyStats(){
        return this.bikeTripService.getMonthlyStats();
    }
}