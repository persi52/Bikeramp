import { NotFoundException } from '@nestjs/common';
import fetch from 'cross-fetch';

export class distanceCalculator{    
    //this class is used for calculating distance between addresses coordinates in straight line
    //I used free API that allows retreiving address coordinates
    //in case of utility project I would use Google Maps Api, so I could calculate exact bike route
    //but Google asks for credit card number
    private locationApiUrl = 'https://nominatim.openstreetmap.org/search?format=json&limit=3&q='
   
    public async getDistance(startAddress : string,destinationAddress : string) : Promise<number>{
       const coordinates = await this.getCoordinates(startAddress,destinationAddress)
       const distance = this.calcCrow(coordinates.startCoordinates.x1, coordinates.startCoordinates.y1
        ,coordinates.destinationCoordinates.x2, coordinates.destinationCoordinates.y2);
        
        return Math.round((Number(distance) + Number.EPSILON) * 100) / 100
    } //function returning straight line distance between 2 addresses in kilometres rounded to 2 decimal places

    private async getCoordinates(startAddress : string,destinationAddress : string){ //function caculating coordinates based on addresses
        let startCoordinates,destinationCoordinates;

        await fetch(this.locationApiUrl + startAddress)
        .then(response => response.json()).then(response => {
            if(response[0])           
            startCoordinates = {
               x1 : response[0].lat,
               y1 : response[0].lon
            }
            else throw new NotFoundException({
                status : 404,
                message: "Start_address is not valid"
            });  
            
        })
        console.log(startCoordinates)
        await fetch(this.locationApiUrl + destinationAddress)
        .then(response => response.json()).then(response => {                      
            if(response[0])
            destinationCoordinates = {
               x2 : response[0].lat,
               y2 : response[0].lon
            }
            else throw new NotFoundException({
                status : 404,
                message: "Destination_address is not valid"
            });  
            
        })
        console.log(destinationCoordinates)
        return {
            startCoordinates,
            destinationCoordinates
        }
    }

    private calcCrow(x1, y1, x2, y2) //function calculating distance between points
    {
      let R = 6371; // km
      let dLat = this.toRad(x2-x1);
      let dLon = this.toRad(y2-y1);
      let lat1 = this.toRad(x1);
      let lat2 = this.toRad(x2);

      let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      let d = R * c;
      return d;
    }

    // function calculating degrees to radiands
    private toRad(Value) 
    {
        return Value * Math.PI / 180;
    }
}