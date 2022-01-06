import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateTripDto } from "src/dto/createTrip.dto";
import { BikeTrip } from "src/entities/bikeTrip.entity";
import { BikeTripService } from "src/services/bikeTrip.service";

@Controller('trips')
export class BikeTripController{

    constructor(private readonly bikeTripService : BikeTripService){}

    @Get()
    getBikeTrips() : Promise<BikeTrip[]>{       

        return this.bikeTripService.getBikeTrips();
    }
    @UsePipes(new ValidationPipe({whitelist: true}))
    @Post()
    createBikeTrip(@Body() body : CreateTripDto) : Promise<BikeTrip>{
        
        return this.bikeTripService.createBikeTrip(body);
    }
}