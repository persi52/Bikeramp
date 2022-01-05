export class BikeTrip{   

    constructor(
        public id : number,
        public start_address : string,
        public destination_address : string,
        public price : number,
        public distance : number,
        public date : string
    ) {}   
    
}