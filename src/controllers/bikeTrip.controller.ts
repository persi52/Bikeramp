import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateTripDto } from "src/dto/createTrip.dto";
import { BikeTrip } from "src/entities/bikeTrip.entity";
import { BikeTripService } from "src/services/bikeTrip.service";

@Controller('api/trips')
export class BikeTripController{

    constructor(private readonly bikeTripService : BikeTripService){}

    @Get()
    getBikeTrips() : BikeTrip[]{
        

        return this.bikeTripService.getBikeTrips();
    }

    @Post()
    createBikeTrip(@Body() body : CreateTripDto) : BikeTrip{
        
        return this.bikeTripService.createBikeTrip(body);
    }
}