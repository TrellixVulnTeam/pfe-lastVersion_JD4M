export class ChatMessageDto {
    user: string;
    message: string;
    date : Date;

    constructor(user: string, message: string){
        this.user = user;
        this.message = message;
        this
    }
}
