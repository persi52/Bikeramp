import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateTripDto } from "src/dto/createTrip.dto";
import { BikeTrip } from "src/entities/bikeTrip.entity";
import { dayTripStats } from "src/entities/dayTripsStats.entity";
import { Repository } from "typeorm";
import { distanceCalculator } from "src/location/distanceCalculator";
import {_} from "lodash"
@Injectable()
export class BikeTripService {    

    private readonly distanceCalculator  = new distanceCalculator();

    constructor(   
        @InjectRepository(BikeTrip)  
        private readonly bikeTripsRepository: Repository<BikeTrip>      
    ){}

    async getBikeTrips(){   
      const response = (await this.bikeTripsRepository.find()).map(bikeTrip => {         
        return this.formatTrip(bikeTrip);
      });
      return response;  
    }

    async createBikeTrip(body : CreateTripDto){
        let newBikeTrip;
        
        newBikeTrip = { 
            ... body,
            price : Math.round((body.price + Number.EPSILON) * 100) / 100,
            distance : await this.distanceCalculator
            .getDistance(body.start_address,body.destination_address)
        }
      
        this.bikeTripsRepository.save(newBikeTrip)

        return this.formatTrip(newBikeTrip);       
    }
   
    async getWeeklyStats(){       
        const weekRange = this.getCurrentWeekRange();
       
        let total_price = 0, total_distance = 0;

        await this.bikeTripsRepository.query('SELECT * FROM bike_trips ' + 
        'WHERE date > $1 AND date < $2',[weekRange.start,weekRange.end])
        .then((results : BikeTrip[]) =>{
           
           for(let i=0;i<results.length;i++){
               
            total_price += results[i].price;              
            total_distance += results[i].distance;       
           }        
        })       

        return {
            total_distance : total_distance.toFixed(2).toString() + 'km',
            total_price : total_price.toFixed(2).toString() + 'PLN'           
        }        
    }

    async getMonthlyStats(){
        const currentDate = new Date()
        const currentMonthName = currentDate.toLocaleString('en-US', { month: 'long' });   
        const dayTrips : dayTripStats[] = [];

        await this.bikeTripsRepository.query('SELECT * FROM bike_trips ' + 
        'WHERE EXTRACT(MONTH FROM date) = $1 ORDER BY EXTRACT(DAY FROM date)',[currentDate.getMonth()+1])
        .then(async (results : BikeTrip[]) => {
           
            let index : number;
            for(let i=0;i<results.length;i++){
                console.log(index, "index")

                index = await _.findIndex(dayTrips, (dayTripStats) => {
                    return dayTripStats.day == results[i].date.getDate();
                }, 0);             
            
                if(index==-1) 
                dayTrips.push({
                    day : results[i].date.getDate(),
                    total_distance : results[i].distance,
                    total_day_price : results[i].price,
                    total_day_rides : 1
                })
                else {
                    dayTrips[index] = {
                    ...dayTrips[index],
                    total_distance : dayTrips[index].total_distance+=results[i].distance,
                    total_day_price :  dayTrips[index].total_day_price+=results[i].price,    
                    total_day_rides :  dayTrips[index].total_day_rides+=1  
                }}
            }
        })

        return dayTrips.map(dayTrip => {               //mapping dayTripStats array to proper response
            return {
                day : currentMonthName + ', ' + this.ordinal_suffix_of(dayTrip.day),
                total_distance: dayTrip.total_distance.toFixed(2) + "km",       
                avg_ride : (dayTrip.total_distance/dayTrip.total_day_rides).toFixed(2) + "km",
                avg_price : (dayTrip.total_day_price/dayTrip.total_day_rides).toFixed(2) + "PLN"
            }
        })  
    } 
    
    getCurrentWeekRange(){    //function calculating start and end of current week using timestamps
        const currentDate = new Date();        
        const dayMilis = 1000*60*60*24;   

        const startOfWeekTimestamp = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
         - (currentDate.getDay())*dayMilis - currentDate.getUTCHours() - currentDate.getUTCMinutes()

        const endOfWeekTimestamp = startOfWeekTimestamp + dayMilis*7;

        const startOfWeekDate = new Date(startOfWeekTimestamp);
        const endOfWeekDate = new Date(endOfWeekTimestamp);

        return{
            start : startOfWeekDate,
            end : endOfWeekDate
        }
    } 
    
    formatTrip(bikeTrip : BikeTrip){   //function formatting bikeTrips output to user-friendly
        return {
            ...bikeTrip,
            price : bikeTrip.price.toFixed(2) + "PLN",
            distance : bikeTrip.distance.toFixed(2) + "km"
        }
    }   

    ordinal_suffix_of(day : number) : string{ //function appending proper suffix to number 
        let j = day % 10,
            k = day % 100;
        if (j == 1 && k != 11) {
            return day + "st";
        }
        if (j == 2 && k != 12) {
            return day + "nd";
        }
        if (j == 3 && k != 13) {
            return day + "rd";
        }
        return day + "th";
    }  
    
}