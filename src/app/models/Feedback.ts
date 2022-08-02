import { Users } from "./Users"

export class Feedback {
    user : any
    message : any
    stars : any
    localTime :any

    constructor(message , stars ){
        this.message = message
        this.stars = stars
    }
}