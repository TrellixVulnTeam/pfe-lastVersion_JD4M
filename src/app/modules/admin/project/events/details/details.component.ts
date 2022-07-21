import {
  HttpClient
} from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import {
  FormGroup,
  NgForm
} from '@angular/forms';
import {
  MatDialog
} from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  loadStripe
} from '@stripe/stripe-js';
import {
  ChatMessageDto
} from 'app/models/chatMessageDto';
import {
  NotifDto
} from 'app/models/NotifDto';
import {
  Program
} from 'app/models/Program';
import {
  TokenStorageService
} from 'app/__services/user_services/ token-storage.service';
import {
  ProductsService
} from 'app/__services/Event_services/products.service';
import {
  UsersService
} from 'app/__services/user_services/users.service';
import {
  WebSocketService
} from 'app/__services/Event_services/web-socket-message.service';
import {
  WebSocketNotifService
} from 'app/__services/Event_services/web-socket-notif.service';
import {
  environment
} from 'environments/environment';
import {
  combineLatest
} from 'rxjs';
import {
  PaymentComponent
} from '../../payment/payment.component';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  encapsulation: ViewEncapsulation.None

})

export class DetailsComponent implements OnInit, OnDestroy {

  stripePromise = loadStripe(environment.stripe);


  latitudedef: number = 35.825603;
  latitude: any;
  longitude: any;
  longitudedef: number = 10.608395;
  form: FormGroup;
  location: Location;
  eventWithPlace: any;
  animationDirection: 'left' | 'right' | 'none';
  currentStep: number;
  isLoggedIn = false;
  username: string;
  id: string;
  product: Program;
  participants: any[];
  notif: any;
  unreadCount: number = 0;
  NotifD: any;
  UserNotif: any;

  recommendedEvents: any
  number: any
  recommendedId = []
  recommendedImage : any




  markers: marker[] = [{
    latitude: this.latitudedef,

    longitude: this.longitudedef,
    label: 'your place',
  }, ];



  ////////////////stripe ///////////////////

  async pay(): Promise < void > {


    const payment = {
      name: this.product.title,
      currency: 'eur',
      // amount on cents *10 => to be on dollar
      amount: parseInt(this.product.price) * 100,
      quantity: '1',
      cancelUrl: 'http://localhost:4200/cancel',
      successUrl: 'http://localhost:4200/success',
    };

    const stripe = await this.stripePromise;
    this.http
    .post(` http://localhost:8082/api/payment`, payment)
    .subscribe((data: any) => {
      console.log(payment);


      // I use stripe to redirect To Checkout page of Stripe platform
      stripe.redirectToCheckout({
        sessionId: data.id,

      });
      console.log(data)

    });
  }


  // Private

  /**
   * Constructor
   *
   * @param {AcademyCourseService} _academyCourseService
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @param {FuseSidebarService} _fuseSidebarService
   */
  constructor(private route: ActivatedRoute, private router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
    private productService: ProductsService,
    private tokenStorageService: TokenStorageService,
    private http: HttpClient,
    private _matDialog: MatDialog,
    public webSocketService: WebSocketService,
    private userService: UsersService,
    public webSocketNotifService: WebSocketNotifService,
  ) {
    // Set the defaults
    this.animationDirection = 'none';
    this.currentStep = 0;

    // Set the private defaults
}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
   
    this.webSocketNotifService.openWebSocket();

    this.product = new Program();

    this.id = this.route.snapshot.params['id'];

    this.productService.getProduct(this.id)
      .subscribe(data => {
        console.log(data)
        this.product = data;
      }, error => console.log(error));
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.username = user.username;

      this.productService.getPartcipants(this.id).subscribe((participants: any[]) => {
        this.participants = participants;

      }, (error: ErrorEvent) => {})

    };

    this.productService.getRecommendation(this.id)
      .subscribe(
        (response) => {
          this.recommendedEvents = response["Events"];
          console.log("response",this.recommendedEvents)

        for (let i in this.recommendedEvents) {
          this.recommendedId.push(this.recommendedEvents[i][0]["$oid"])
          if (this.recommendedEvents[i][7][0]!= undefined) {
          console.log("response",this.recommendedEvents[i][7][0]["$binary"])
        this.recommendedImage = this.recommendedEvents[i][7][0]["$binary"]
        }


        }


        },
        (error) => {
          console.log("No Data Found" + error);
        }

      )

  }
 






  addParticipant() {
    this.productService.addParticipant(this.tokenStorageService.getUser().id.toString(), this.id, this.product).subscribe(data => console.log(data), error => console.log(error));
    this.product = new Program();

  }
  onSubmit() {
    console.log("product1", this.product)

    this.addParticipant();
    console.log("product", this.product)





  }
  reloadPage(): void {
    window.location.reload();
  }

  onLocationSelected(location: Location) {
    this.productService.addPlace(this.product.id, location).subscribe(data2 => {
      console.log("data", data2)
      this.eventWithPlace = data2;
      this.latitude = this.eventWithPlace.place.latitude;
      this.longitude = this.eventWithPlace.place.longitude
    }, error => console.log(error));

    return location;
  }

  payment(): void {
    this._matDialog.open(PaymentComponent, {
      autoFocus: false,
      height: '300px',




    });
  }

  ngOnDestroy(): void {
    this.webSocketService.closeWebSocket();
    this.webSocketNotifService.closeWebSocket();

  }
 

  sendMessage(sendForm: NgForm) {



    this.userService.addNotifToUser(this.product.organizer.id, this.username + " " + "has reserved" + " " + this.product.title).subscribe(data => {
      console.log("data", data)
      this.notif = data;











      const notifDtoR = new NotifDto(this.product.organizer.id, this.username + " " + "has reserved" + " " + this.product.title, this.notif.notifCount, this.unreadCount);

      this.webSocketNotifService.sendMessage(notifDtoR);
      console.log("h", notifDtoR);
    })














  }



}
interface marker {
  latitude: number;
  longitude: number;
  label ? : string;
}
interface Location {
  latitude: number;
  longitude: number;
}