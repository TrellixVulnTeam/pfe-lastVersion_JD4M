import {formatDate} from '@angular/common';
import {Component,ElementRef,OnDestroy,OnInit,Output, ViewChild} from '@angular/core';
import {FormBuilder,Validators} from '@angular/forms';
import {MatRadioButton} from '@angular/material/radio';
import { ActivatedRoute,Router} from '@angular/router';
import {Program} from 'app/models/Program';
import { Users} from 'app/models/Users';
import {TokenStorageService} from 'app/__services/user_services/ token-storage.service';
import { ProductsService} from 'app/__services/Event_services/products.service';
import { UsersService} from 'app/__services/user_services/users.service';
import { WebSocketNotifService } from 'app/__services/Event_services/web-socket-notif.service';
import { NotifDto } from 'app/models/NotifDto';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent implements OnInit,OnDestroy {

  @Output() reserved = false;

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
    defaultChecked2: [''],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  creditCard = false;
  isLinear = false;
  id: string;
  user: Users;
  value: any;
  product: Program;
  loading = false;
  currentDate: any;
  myDate = new Date();
  selectedOption: string;
  username: string;
  isLoggedIn = false;
  IsReserved = false;
  notif : any;
  unreadCount : any;

  constructor(private _formBuilder: FormBuilder,
    private productService: ProductsService,
    private tokenStorageService: TokenStorageService,
    private route: ActivatedRoute, private router: Router,
    private userService: UsersService,
    public webSocketNotifService: WebSocketNotifService,

  ) {

  }

  ngOnInit(): void {
    this.webSocketNotifService.openWebSocket();
    this.currentDate = formatDate(this.myDate, 'yyyy-MM-dd', 'en-US');
    // Subscribe to courses
    console.log("vale", this.value);
    this.id = this.route.snapshot.params['id'];
    this.productService.getProduct(this.id)
      .subscribe(data => {
        console.log("product",data)
        this.product = data;
      }, error => console.log(error));
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.username = user.username;
    this.userService.getUser(this.tokenStorageService.getUser().id).subscribe((users: Users) => {
      this.user = users;
      console.log("user", this.user)
    }, (error: ErrorEvent) => {})
  }
  }
  selectChangeHandler(event: any) {
    //update the ui
    this.selectedOption = event.target.value;
  }

  getIsReserved(event) {
    console.log("isReserved",event);
    this.IsReserved= event;
    console.log("isReserved2",this.IsReserved);


  }
  ngOnDestroy() {
  
    //this.webSocketNotifService.closeWebSocket();

  }

  AddPendingParticipant() {
    this.productService.addPendingParticipant(this.tokenStorageService.getUser().id.toString(), this.id, this.product).subscribe(data => console.log(data), error => console.log(error));
    this.userService.addNotifToUser(this.product.organizer.id, this.username + " " + "has chosen to pay cash for" + " " + this.product.title +" " + "please make sure to accept him/her after payment.").subscribe(data => {
      console.log("data",data)
      this.notif = data; 
 
      const notifDtoR = new NotifDto(this.product.organizer.id,this.username + " " + "has chosen to pay cash for" + " " + this.product.title +" " + "please make sure to accept him/her after payment.",this.notif.notifCount, this.unreadCount);

    this.webSocketNotifService.sendMessage(notifDtoR);
    console.log("h",notifDtoR);     })


}
captureScreen() {
  let data = document.getElementById('contentToConvert');
  html2canvas(data as any).then(canvas => {
      var imgWidth = 210;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      let pdfData = new jsPDF('p', 'mm', 'a4');
      var position = 0;
      pdfData.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdfData.save(`MyPdf.pdf`);
  });
}
  
}