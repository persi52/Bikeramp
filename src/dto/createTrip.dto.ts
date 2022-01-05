import { IsNotEmpty } from "class-validator";

export class CreateTripDto{

    @IsNotEmpty()
    start_adress : string;
    @IsNotEmpty()
    destination_adress : string;    
    @IsNotEmpty()
    price : string;
    @IsNotEmpty()
    date : string;
}