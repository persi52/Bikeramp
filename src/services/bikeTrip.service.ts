import { Injectable } from "@nestjs/common";
import { CreateTripDto } from "src/dto/createTrip.dto";
import { BikeTrip } from "src/entities/bikeTrip.entity";
import { bikeTrips } from "./trips";

@Injectable()
export class BikeTripService {
    private months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];

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
        let weeklyStats;
        let a = [];        
        let bikeTripDate; 
        const currentDate = new Date();    
        let rides = 0;    
        //const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });

        this.bikeTrips.forEach(bikeTrip => {
            a = bikeTrip.date.split('-');
           // bikeTripDate = new Date(a[0],a[1]-1,a[2]+1);
            
           if(a[1]-1==currentDate.getMonth())
            rides++;
           
        })
        console.log(rides)
    }

    getMonthlyStats(){

    }
}