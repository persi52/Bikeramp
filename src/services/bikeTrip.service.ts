import { Injectable } from "@nestjs/common";
import { CreateTripDto } from "src/dto/createTrip.dto";
import { BikeTrip } from "src/entities/bikeTrip.entity";
import { dayTripStats } from "src/entities/dayTripsStats.entity";
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
                         
        //const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });          

        this.bikeTrips.forEach(bikeTrip => {

            bikeTripDate = this.convertDate(bikeTrip.date);            

            if(this.isDateOnCurrentWeek(bikeTripDate))
            {
                total_price += bikeTrip.price;
                console.log(total_price, bikeTrip.id)
                total_distance += bikeTrip.distance;                
            }           
        })

        return {
            total_distance : total_distance.toString() + 'km',
            total_price : total_price.toString() + 'PLN'           
        }        
    }

    getMonthlyStats() : dayTripStats[]{
        const statsArray : dayTripStats[] = [];
        const currentDate = new Date(); 
        let bikeTripDate;

        this.bikeTrips.forEach(bikeTrip => {
            bikeTripDate = this.convertDate(bikeTrip.date);
            
            if(bikeTripDate.getMonth()-1 == currentDate.getMonth())
                console.log(bikeTripDate)
        })

        return statsArray;
    }  

    convertDate(stringDate : string) : Date{

        let convertedDate = new Date();
        let splitedDate = stringDate.split('-');   
       
        convertedDate.setDate(Number(splitedDate[2]))
        convertedDate.setMonth(Number(splitedDate[1])-1)
        convertedDate.setFullYear(Number(splitedDate[0]))
        console.log(convertedDate)
        return convertedDate;
    }

    isDateOnCurrentWeek(bikeTipDate : Date) : boolean{  
        const currentDate = new Date()        
        const dayMilis = 1000*60*60*24;      
     
        const bikeTipDateTimestamp = Date.UTC(bikeTipDate.getFullYear(), bikeTipDate.getMonth(), bikeTipDate.getDate());
        const startOfWeekTimestamp = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
         - (currentDate.getDay())*dayMilis - currentDate.getUTCHours() - currentDate.getUTCMinutes();
        const endOfWeekTimestamp = startOfWeekTimestamp + dayMilis*7;

        return bikeTipDateTimestamp > startOfWeekTimestamp 
        && bikeTipDateTimestamp <  endOfWeekTimestamp ? true : false;
    }
   
}