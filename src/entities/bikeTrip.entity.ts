import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('bike_trips')
export class BikeTrip{  

        @PrimaryGeneratedColumn()
        public id : number;
        @Column()
        public start_address : string;
        @Column()
        public destination_address : string;
        @Column({type : 'float'})
        public price : number;
        @Column()
        public distance : number;
        @CreateDateColumn({type: 'timestamptz'})
        public date : Date;  
    
}