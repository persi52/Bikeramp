import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, Length, Matches, Min } from "class-validator";

export class CreateTripDto{   

    @ApiProperty({description: 'Format example: Plac Europejski 2, Warszawa, Polska', default: 'Plac Europejski 2, Warszawa, Polska'})
    @IsNotEmpty()@Length(1,100)//@Matches(/^(.*)+\d+,+(.*)+,+ ?[a-z]*/gi) //possible regex but isn't eventually used
    start_address : string;

    @ApiProperty({description: 'Format example: Plac Europejski 2, Warszawa, Polska', default: 'Aleje jerozolimskie 114, Warszawa, Polska'})
    @IsNotEmpty()@Length(1,100)//@Matches(/^(.*)+\d+,+(.*)+,+ ?[a-z]*/gi) //possible regex but isn't eventually used
    destination_address : string;    

    @ApiProperty()@IsNotEmpty()@Min(0)
    price : number;

    @ApiProperty({description: 'Date in format yyyy-mm-dd', default: '2022-01-01'})@IsNotEmpty() @IsDateString()
    date : string;
}