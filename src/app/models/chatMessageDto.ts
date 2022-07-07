export class ChatMessageDto {
    user: any;
    message: string;
    date : Date;

    constructor(user: any, message: string, date : Date){
        this.user = user;
        this.message = message;
        this.date = date;
    }

  
}
