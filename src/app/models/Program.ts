import { Image } from "./Image"
import { Place } from "./place"
import { Users } from "./Users"

export class Program {
    id: string
    organizer: Users
    title: string
    description: string
    price: string
    prices: string
    pics: any
    image: string
    type: string
    link: string
    plateform: string
    plateformLogo: string
    place: Place
    date: Date ;
    remindred =false;

    dateS: any
    participants: [any]
    cree?: any;
    participant?: any[];

}