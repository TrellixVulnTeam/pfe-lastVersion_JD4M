import {
  HttpClient
} from '@angular/common/http';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  MatDialog
} from '@angular/material/dialog';
import {
  MatSnackBar
} from '@angular/material/snack-bar';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  Program
} from 'app/models/Program';
import {
  Users
} from 'app/models/Users';
import {
  TokenStorageService
} from 'app/__services/user_services/ token-storage.service';
import {
  CartItemsService
} from 'app/__services/Event_services/cart-items.service';
import {
  ImageService
} from 'app/__services/user_services/image.service';
import {
  ProductsService
} from 'app/__services/Event_services/products.service';
import {
  UsersService
} from 'app/__services/user_services/users.service';
import {
  AuthenComponent
} from '../../user/authen/authen.component';
import {
  FormsWizardsComponent
} from '../add-event/wizards/wizards.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  public term: string

  products: Program[];
  isLoggedIn = false;
  view: string;
  SameId = false;
  Null: null;
  username: string;
  User: Users;
  id: string;
  program: Program;
  lat: string = '';
  lng: string = ''



  constructor(
    private router: Router,
    route: ActivatedRoute,
    private productsService: ProductsService,
    private UserService: UsersService,
    private tokenStorageService: TokenStorageService,
    private _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    // Set the defaults

    this.productsService.getProducts().subscribe((products: Program[]) => {
      this.products = products;
      console.log("program", this.products)

    }, (error: ErrorEvent) => {})

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.username = user.username;


      //console.log('org',this.productsService.getOrganizer(this.products))
      console.log('name', this.tokenStorageService.getUser());




    }
    //this.http.get("http://localhost:8081/api/events/all/image/" + this.program.id).subscribe(response => {
      //this.program.pics = 'data:image/jpeg;base64,' + response;
    //});

  }




  eventDetails(id: string) {

    this.router.navigate(['courses', id]);
  }

  deleteEvent(id: string) {
    this.productsService.deleteEvent(id)
      .subscribe(
        data => {
          console.log(data);
          this._matSnackBar.open('Event deleted', 'OK', {
            verticalPosition: 'top',
            duration: 2000
          });


        },
        error => console.log(error));
    this.reloadPage();

  }
  reloadPage(): void {
    window.location.reload();
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Filter courses by category
   */

  
  addNewNote(): void {
    this._matDialog.open(FormsWizardsComponent, {
      autoFocus: false,
      height: '700px',




    });
  }

  login(): void {
    this._matDialog.open(AuthenComponent, {
      autoFocus: false,
      height: '700px',




    });
  }



  // Set the private defaults

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Filter courses by category
   */
}