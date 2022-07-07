import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { loadStripe } from '@stripe/stripe-js';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent  {

    // We load  Stripe
    stripePromise = loadStripe(environment.stripe);
    constructor(private http: HttpClient) {}
  
    async pay(): Promise<void> {
      // here we create a payment object
      const payment = {
        name: 'gy',
        currency: 'usd',
        // amount on cents *10 => to be on dollar
        amount: 99900,
        quantity: '1',
        cancelUrl: 'http://localhost:4200/cancel',
        successUrl: 'http://localhost:4200/success',
      };
  
      const stripe = await this.stripePromise;
  
      // this is a normal http calls for a backend api
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
  }
  