import fetch from 'cross-fetch';

export class distanceCalculator{
    //w tej klasie wyliczana jest odległość między kordynatami adresów w linii prostej
    //użyłem darmowego api pozwalającego na pobranie kordynatów adresów
    //w przypadku użytkowego projektu użyłbym Google Maps Api, wtedy bym wyliczył dokładną trasę rowerową
    //ale trzeba tam oficjalnie autoryzować i podpinać kartę
    
    private locationApiUrl = 'https://nominatim.openstreetmap.org/search?format=json&limit=3&q='

    public async getDistance(startAddress : string,destinationAddress : string) : Promise<number>{
       const coordinates = await this.getCoordinates(startAddress,destinationAddress)
       const distance = this.calcCrow(coordinates.startCoordinates.x1, coordinates.startCoordinates.y1
        ,coordinates.destinationCoordinates.x2, coordinates.destinationCoordinates.y2);
        
        return Math.round((Number(distance) + Number.EPSILON) * 100) / 100
    }

    private async getCoordinates(startAddress : string,destinationAddress : string){
        let startCoordinates,destinationCoordinates;

        await fetch(this.locationApiUrl + startAddress)
        .then(response => response.json()).then(response => {
                console.log(response[0]) 
           
            startCoordinates = {
               x1 : response[0].lat,
               y1 : response[0].lon
            }
        })
        console.log(startCoordinates)
        await fetch(this.locationApiUrl + destinationAddress)
        .then(response => response.json()).then(response => {                      
            console.log(response[0]) 
            destinationCoordinates = {
               x2 : response[0].lat,
               y2 : response[0].lon
            }
        })
        console.log(destinationCoordinates)
        return {
            startCoordinates,
            destinationCoordinates
        }
    }

    private calcCrow(x1, y1, x2, y2) 
    {
      var R = 6371; // km
      var dLat = this.toRad(x2-x1);
      var dLon = this.toRad(y2-y1);
      var lat1 = this.toRad(x1);
      var lat2 = this.toRad(x2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
    }

    // Converts numeric degrees to radians
    private toRad(Value) 
    {
        return Value * Math.PI / 180;
    }
}