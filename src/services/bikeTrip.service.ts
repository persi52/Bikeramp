import { ConsoleLogger, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateTripDto } from "src/dto/createTrip.dto";
import { BikeTrip } from "src/entities/bikeTrip.entity";
import { dayTripStats } from "src/entities/dayTripsStats.entity";
import { dayTripStatsResp } from "src/entities/dayTripStatsResp.entity";
import { Repository } from "typeorm";
import { bikeTrips } from "./trips";

@Injectable()
export class BikeTripService {    

    private bikeTrips = bikeTrips;

    constructor(   
        @InjectRepository(BikeTrip)  
        private readonly bikeTripsRepository: Repository<BikeTrip>
    ){}

    getBikeTrips() : Promise<BikeTrip[]>{
        return this.bikeTripsRepository.find();
    }

    createBikeTrip(body : CreateTripDto) : Promise<BikeTrip>{
        let newBikeTrip;

        newBikeTrip = { 
            ... body,
            distance : 10
        }
      
        this.bikeTripsRepository.save(newBikeTrip)
        return newBikeTrip;
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
            total_distance : total_distance.toString() + 'km',
            total_price : total_price.toString() + 'PLN'           
        }        
    }

    async getMonthlyStats(){
        const currentDate = new Date()
        const currentMonthName = currentDate.toLocaleString('en-US', { month: 'long' });   
        const dayTrips : dayTripStats[] = [];

        await this.bikeTripsRepository.query('SELECT * FROM bike_trips ' + 
        'WHERE EXTRACT(MONTH FROM date) = $1',[currentDate.getMonth()+1])
        .then(async (results : BikeTrip[]) => {
           
            let index : number;
            for(let i=0;i<results.length;i++){
               // console.log(dayTrips)

                index = await dayTrips.findIndex(async bikeTripStats => {    
                    console.log(bikeTripStats.day,results[i].date.getDate())                               
                    return (results[i].date.getDate()==bikeTripStats.day)
                })
                console.log(index, "index")
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

        return dayTrips.map(dayTrip => {
            
            return {
                day : currentMonthName + ', ' + this.ordinal_suffix_of(dayTrip.day),
                total_distance: dayTrip.total_distance + "km",       
                avg_ride : dayTrip.total_distance/dayTrip.total_day_rides + "km",
                avg_price : dayTrip.total_day_price/dayTrip.total_day_rides + "PLN"
            }
        })  
    } 

    getCurrentWeekRange(){
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
    ordinal_suffix_of(day : number) : string{
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