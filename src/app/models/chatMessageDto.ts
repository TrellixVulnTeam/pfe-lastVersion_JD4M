export class ChatMessageDto {
    user: string;
    message: string;
    date : Date;
    countNotif

    constructor(user: string, message: string, date : Date){
        this.user = user;
        this.message = message;
        this.date = date;
    }

  
}
