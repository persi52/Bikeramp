import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiCreatedResponse, ApiOperation } from "@nestjs/swagger";
import { Observable } from "rxjs";
import { CreateTripDto } from "src/dto/createTrip.dto";
import { BikeTrip } from "src/entities/bikeTrip.entity";
import { BikeTripService } from "src/services/bikeTrip.service";

@Controller('trips')
export class BikeTripController{

    constructor(private readonly bikeTripService : BikeTripService){}

    @ApiOperation({ summary: 'Get all bike trips' })
    @Get()
    getBikeTrips(){       
        return this.bikeTripService.getBikeTrips();
    }

    @UsePipes(new ValidationPipe({whitelist: true}))   
    @ApiOperation({ summary: 'Add bike trip to database' })
    @Post()
    createBikeTrip(@Body() body : CreateTripDto){
        
        return this.bikeTripService.createBikeTrip(body);
    }
}