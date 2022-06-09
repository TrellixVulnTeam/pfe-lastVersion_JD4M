import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatMessageDto } from 'app/models/chatMessageDto';
import { Program } from 'app/models/Program';
import { TokenStorageService } from 'app/__services/ token-storage.service';
import { ProductsService } from 'app/__services/products.service';
import { WebSocketService } from 'app/__services/web-socket-message.service';
import { WebSocketNotifService } from 'app/__services/web-socket-notif.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatsComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  username :string;
isMine : false;
  id: string;
  product: Program;
  participants : any[];
  date : Date

  EventChat : any;

  constructor(public webSocketService: WebSocketService,
    public webSocketNotifService: WebSocketNotifService,
    private productService : ProductsService,
    private tokenStorageService : TokenStorageService,
    private route: ActivatedRoute,private router: Router,) { }

  ngOnInit(): void {
    this.webSocketService.openWebSocket();

    this.product = new Program();
  
    this.id = this.route.snapshot.params['id'];

    this.productService.getchatRoomByEvent(this.id)
    .subscribe(data => {
      console.log("chat",data)
    
      this.EventChat = data;
    }, error => console.log(error));
    
    
    this.productService.getProduct(this.id)
      .subscribe(data => {
        console.log(data)
        this.product = data;
      }, error => console.log(error));
      this.isLoggedIn = !!this.tokenStorageService.getToken();

      if (this.isLoggedIn) {
        const user = this.tokenStorageService.getUser();
        this.username = user.username;

        



      /*this.productService.getPartcipants(this.id).subscribe((participants : any[]) => {
        this.participants = participants;
         
    }, (error: ErrorEvent) => {
    })*/
    
    }
  }

  ngOnDestroy(): void {
    this.webSocketService.closeWebSocket();
  }

  sendMessage(sendForm: NgForm) {
    const chatMessageDto = new ChatMessageDto(this.username, sendForm.value.message,);
    this.webSocketService.sendMessage(chatMessageDto);
    sendForm.controls.message.reset();
    this.productService.addChatToEvent(this.product.id,this.tokenStorageService.getUser().id,chatMessageDto.message).subscribe(data => {
      console.log("data",data)


    }, error => console.log(error));
   
    console.log("h",chatMessageDto);


  }
}

