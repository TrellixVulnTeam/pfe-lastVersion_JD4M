import { Image } from "./Image"
import { Place } from "./place"
import { Users } from "./Users"

export class Program {
    id : string
    organizer : Users
    title : string
    description : String
    price : String
    pics : any
    image : string
    type : string
    link : String
    place : Place
    participants: [any]

}