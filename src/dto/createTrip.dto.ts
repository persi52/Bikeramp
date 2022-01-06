import { IsNotEmpty, Length } from "class-validator";

export class CreateTripDto{

    @IsNotEmpty()@Length(1,100)
    start_address : string;
    @IsNotEmpty()
    destination_address : string;    
    @IsNotEmpty()
    price : string;
    @IsNotEmpty()
    date : string;
}