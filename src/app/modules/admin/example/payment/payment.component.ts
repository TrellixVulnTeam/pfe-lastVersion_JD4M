import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AppDialogComponent } from 'app/__services/dialog.component';
import { PlutoService } from 'app/__services/pluto.service';
import { StripeService, StripeCardComponent } from "ngx-stripe";
import { switchMap } from 'rxjs';
import { AngularStripeService } from '@fireflysemantics/angular-stripe-service'
import { Program } from 'app/models/Program';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'app/__services/products.service';
import { TokenStorageService } from 'app/__services/ token-storage.service';
import { Card } from 'app/models/Card';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements AfterViewInit, OnDestroy {

  @ViewChild('cardInfo', { static: false }) cardInfo: ElementRef;


  id : string;
  product : Program;
  stripe;
  loading = false;
  confirmation;
  isLoggedIn = false;
  cards: Card;
username : string;
  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;

  constructor(
    private cd: ChangeDetectorRef,
    private stripeService:AngularStripeService,
    private dialog: MatDialog,
    private route: ActivatedRoute,private router: Router,
          private _changeDetectorRef: ChangeDetectorRef,
          private productService : ProductsService,
          private tokenStorageService : TokenStorageService,

    ) {}

  ngAfterViewInit() {
    this.stripeService.setPublishableKey('pk_test_2syov9fTMRwOxYG97AAXbOgt008X6NL46o').then(
      stripe=> {
        this.stripe = stripe;
    const elements = stripe.elements();    
    this.card = elements.create('card');
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
    });
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  async onSubmit(form: NgForm) {
    const { token, error } = await this.stripe.createToken(this.card);

    if (error) {
      this.openDialog({ success: false  });

      console.log('Error:', error);
    } else {
      this.openDialog({ success: true  });


      console.log('Success!', token.card.last4);

      this.productService.validateCart(token.card.last4).subscribe((card : Card) => {
        this.cards = card;

        if( this.cards.amount < Number(this.product.prices))
        {console.log("erreur")}
        else {console.log("success");
        this.productService.DecreaseAmountCard(token.card.last4,Number(this.product.prices)).subscribe((card : Card) => {
          this.cards = card;    

      console.log( "4",   this.cards.amount
      )}
      )}}
  )}
  }


  openDialog(data) {
    this.dialog.open(AppDialogComponent, { data });
    console.log('data',data)
  }

  ngOnInit(): void
  {
      // Subscribe to courses
    

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
              


               
          
          
          }
      }
          
      
}