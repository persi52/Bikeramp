import { Injectable } from "@nestjs/common";
import { CreateTripDto } from "src/dto/createTrip.dto";
import { BikeTrip } from "src/entities/bikeTrip.entity";
import { bikeTrips } from "./trips";

@Injectable()
export class BikeTripService {    

    private bikeTrips = bikeTrips;

    getBikeTrips() : BikeTrip[]{
        return this.bikeTrips;
    }

    createBikeTrip(body : CreateTripDto) : BikeTrip{
        let newBikeTrip;

        newBikeTrip = { ... body}

        bikeTrips.push(newBikeTrip);

        return newBikeTrip;
    }

    getWeeklyStats(){
        let total_price = 0, total_distance = 0;
        let bikeTripDate = new Date();             
        const currentDate = new Date();  
        let isTripInCurrentWeek : boolean;               
        //const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' }); 
        const begginingOfWeekDate = currentDate.getDate() - currentDate.getDay();        
        const endOfWeekDate = begginingOfWeekDate + 6;
        

        this.bikeTrips.forEach(bikeTrip => {

            bikeTripDate = this.convertDate(bikeTrip.date);   
            isTripInCurrentWeek = bikeTripDate.getDate() <= endOfWeekDate 
            && begginingOfWeekDate < bikeTripDate.getDate() ? true : false;

            if(isTripInCurrentWeek)
            {
                total_price += bikeTrip.price;
                total_distance += bikeTrip.distance;
            }           
        })

        return {
            total_distance : total_distance.toString() + 'km',
            total_price : total_price.toString() + 'PLN'           
        }        
    }

    getMonthlyStats(){
        
    }  

    convertDate(stringDate : string) : Date{

        let convertedDate = new Date();
        let splitedDate = stringDate.split('-');   

        convertedDate.setDate(Number(splitedDate[2]))
        convertedDate.setMonth(Number(splitedDate[1]))
        convertedDate.setFullYear(Number(splitedDate[0]))

        return convertedDate;
    }


}