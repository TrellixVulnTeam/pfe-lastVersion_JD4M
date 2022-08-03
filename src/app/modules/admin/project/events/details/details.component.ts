import {
  HttpClient
} from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  Inject,
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
  MatDialog, MAT_DIALOG_DATA
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
  combineLatest, Subject, takeUntil, tap
} from 'rxjs';
import {
  PaymentComponent
} from '../../payment/payment.component';
import {
  AuthenComponent
} from '../../user/authen/authen.component';
import {
  Users
} from 'app/models/Users';
import { AddFeedbackComponent } from './add-feedback/add-feedback.component';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  encapsulation: ViewEncapsulation.None

})

export class DetailsComponent implements OnInit, OnDestroy {

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
  feedbacks: any 
  rating : number
  recommendedEvents2 = []
  number: any
  recommendedId = []
  user: Users;
  OneOfPartcipants = false
  organizer = false;
  recommendedImage: any
  markers: marker[] = [{
    latitude: this.latitudedef,

    longitude: this.longitudedef,
    label: 'your place',
  }, ];

  private destroy$: Subject<any> = new Subject<any>();


  ////////////////stripe ///////////////////




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


    // Set the private defaults
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.productService.getReloadFeedback().pipe(
      tap(value => {
        if (value === true) {
          this.getFeedbacks();
        }
      }
      ),
      takeUntil(this.destroy$)
    ).subscribe();

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
      this.userService.getUser(this.tokenStorageService.getUser().id).subscribe((user: Users) => {
        this.user = user;
        console.log(this.user)
      })
      this.productService.getPartcipants(this.id).subscribe((participants: any[]) => {
        this.participants = participants;
        for (let item of this.participants) {

          if (this.username == item.username) {
            console.log(item);

            this.OneOfPartcipants = true;
            console.log(this.OneOfPartcipants)

            break;
          }
        }
        if (this.username == this.product.organizer.username) {
          this.organizer = true
        }
      }, )

    };

    this.productService.getRecommendation(this.id)
      .subscribe(
        (response) => {
          this.recommendedEvents = response["Events"];
          console.log("response2", this.recommendedEvents)

          for (let i = 0; i < this.recommendedEvents.length; i++) {
            //this.recommendedId.push(this.recommendedEvents[i]["$oid"])
            this.productService.getProduct(this.recommendedEvents[i]["$oid"]).subscribe(data => {
              this.recommendedEvents2.push(data)

            }, error => console.log(error));
          }
          console.log("id", this.recommendedEvents2)

        },

        (error) => {
          console.log("No Data Found" + error);
        })



       this.getFeedbacks();

     
      }

      getFeedbacks() {
        this.productService.getFeedbacks(this.id).subscribe(data => {
          this.feedbacks = data
          console.log("feedbacks",this.feedbacks)

          let sum = 0;

          for (let i = 0; i < this.feedbacks.length; i++) {
              sum += this.feedbacks[i].stars; 
          this.rating = (sum/this.feedbacks.length)
          console.log(this.rating)
            }

            this._changeDetectorRef.markForCheck()
          
          

        }, error => console.log(error));
        
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
  login(): void {
    this._matDialog.open(AuthenComponent, {
      autoFocus: false,
      height: '700px',
    });
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
    //this.webSocketService.closeWebSocket();
    //this.webSocketNotifService.closeWebSocket();
    this.destroy$.next(undefined);
    this.destroy$.complete();
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

  ProfileDetails(id) {
    this.router.navigateByUrl('/events/carduser/', id);

  }

  addFeedback(): void {

    
    const dialogRef = this._matDialog.open(AddFeedbackComponent, {
      autoFocus: false,
      height: '700px',
      data: { id: this.id }
    });
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