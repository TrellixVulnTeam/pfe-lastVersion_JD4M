export class NotifDto {
    user: string;
    message: string;
    date : Date;
    countNotifR : number =0;
    countNotifS : number = 0;

    constructor(user: string, message: string, countNotifR : number, countNotifS : number ){
        this.user = user;
        this.message = message;
        this.countNotifR = countNotifR;
        this.countNotifS = countNotifS
    }

  
}
