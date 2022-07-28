import { ContentObserver } from '@angular/cdk/observers';
import { DatePipe, formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatMessageDto } from 'app/models/chatMessageDto';
import { Program } from 'app/models/Program';
import { Users } from 'app/models/Users';
import { TokenStorageService } from 'app/__services/user_services/ token-storage.service';
import { ProductsService } from 'app/__services/Event_services/products.service';
import { UsersService } from 'app/__services/user_services/users.service';
import { WebSocketService } from 'app/__services/Event_services/web-socket-message.service';
import { WebSocketNotifService } from 'app/__services/Event_services/web-socket-notif.service';
import moment from 'moment';
import { CartProfileComponent } from '../../user/cart-profile/cart-profile.component';

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
  date : any;
  user : Users;
  text = "<i class="+"fas fa-user"+"> </i>"
  myDate = new Date();
  today = false;  
  currentDate : any ;
  day : any;
  EventChat : any;

  constructor(public webSocketService: WebSocketService,
    public webSocketNotifService: WebSocketNotifService,
    private productService : ProductsService,
    
    private tokenStorageService : TokenStorageService,
    private route: ActivatedRoute,private router: Router,
    private userService : UsersService,
    private _matDialog: MatDialog,
    
    ) { }

  ngOnInit(): void {
    this.webSocketService.openWebSocket();
    this.currentDate = formatDate(this.myDate, 'yyyy-MM-dd', 'en-US');
    console.log(this.currentDate)
    console.log("CurrentDate",this.currentDate.split("-"));
    console.log("CurrentDay",this.currentDate.split("-")[2]);
    console.log("CurrentMonth",this.currentDate.split("-")[1]);
    console.log("CurrentYear",this.currentDate.split("-")[0])

    this.product = new Program();
    this.id = this.route.snapshot.params['id'];
    this.productService.getchatRoomByEvent(this.id)
    .subscribe(data => {
      this.EventChat = data;
      console.log("chat",this.EventChat)
      for ( let chat of this.EventChat) {
          this.day= chat.localTime.split("-")[2];
        console.log("year",chat.localTime.split("-")[0]);
        console.log("month",chat.localTime.split("-")[1]);
        console.log("day",chat.localTime.split("-")[2].split("T")[0]);
  }

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
    }
    this.date = moment().format("MMM dd, h:mm a");
    console.log("date",this.myDate)
   if(this.isLoggedIn) {
    this.userService.getUser(this.tokenStorageService.getUser().id
    ).subscribe((users : Users) => {
        this.user = users;
        console.log("user",this.user)   
    }, (error: ErrorEvent) => {
    }) }
    this.productService.getPartcipants(this.id).subscribe((participants: any[]) => {
      this.participants = participants;
      console.log("participants",this.participants)
    }, (error: ErrorEvent) => {})
  };
  ngOnDestroy(): void {
    this.webSocketService.closeWebSocket();
  }
  sendMessage(sendForm: NgForm) {
    
    const chatMessageDto = new ChatMessageDto(this.tokenStorageService.getUser().username, sendForm.value.message,this.myDate);
    this.webSocketService.sendMessage(chatMessageDto);
    this.productService.addChatToEvent(this.product.id,this.tokenStorageService.getUser().id,chatMessageDto.message).subscribe(data => {
      console.log("data",data)
    }, error => console.log(error));
    console.log("h",chatMessageDto);
    
   
  }
  ShowUserDetails() {
    this._matDialog.open(CartProfileComponent, {
      autoFocus: false,
      height: '700px',  
  });
  
  }
}

