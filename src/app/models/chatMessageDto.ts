export class ChatMessageDto {
    user: string;
    message: string;
    date : Date;
    countNotif

    constructor(user: string, message: string){
        this.user = user;
        this.message = message;
    }

  
}
