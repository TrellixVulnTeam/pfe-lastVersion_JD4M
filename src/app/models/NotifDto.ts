export class NotifDto {
    user: string;
    message: string;
    date : Date;
    countNotif : number =0;

    constructor(user: string, message: string, countNotif : number){
        this.user = user;
        this.message = message;
        this.countNotif = countNotif;
    }

  
}
