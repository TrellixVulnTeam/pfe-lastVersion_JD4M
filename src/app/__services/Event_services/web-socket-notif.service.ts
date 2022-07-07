import { Injectable } from '@angular/core';
import { ChatMessageDto } from 'app/models/chatMessageDto';
import { NotifDto } from 'app/models/NotifDto';

@Injectable({
  providedIn: 'root'
})
export class WebSocketNotifService {

  webSocket: WebSocket;
  chatMessages: ChatMessageDto[] = [];
  notifMessages: NotifDto[] = [];

  constructor() { }

  public openWebSocket(){
    this.webSocket = new WebSocket('ws://localhost:8081/api/events/notif');

    this.webSocket.onopen = (event) => {
      console.log('Open: ', event);
    };

    this.webSocket.onmessage = (event) => {
      const notifDto = JSON.parse(event.data);
      this.notifMessages.push(notifDto);
    };

    this.webSocket.onclose = (event) => {
      console.log('Close: ', event);
    };
  }

  public sendMessage(notifDto: NotifDto){
    this.webSocket.send(JSON.stringify(notifDto));
  }

  public closeWebSocket() {
    this.webSocket.close();
  }
}
