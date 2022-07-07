import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartItem } from 'app/models/CartItem';
import { Users } from 'app/models/Users';
import { BehaviorSubject, Observable } from 'rxjs';




@Injectable({
    providedIn: 'root'
  })
  export class CartItemsService {
    onProductChanged: BehaviorSubject<any>;

      constructor(private http : HttpClient) {
        this.onProductChanged = new BehaviorSubject({});

       }
  
      
      getCartItems () : Observable<CartItem[]> {
        return this.http.get<CartItem[]>(`http://localhost:8081/api/users/cart-items`)
    }
  
      addToUserCart (userId : string, productId : string) : Observable<Users> {
          return this.http.post<Users>(`http://localhost:8081/api/users/${userId}/cart/add/${productId}`, {
          })
      }
      addToCart (userId : string,program: Object) : Observable<Object> {
        return this.http.post<Object>(`http://localhost:8081/api/users/${userId}/cart/add`, program);
    }
  
      getUserCart (userId : string) : Observable<CartItem[]> {
          return this.http.get<CartItem[]>(`http://localhost:8081/api/users/${userId}/cart`)
      }
  
      updateUserCartItem (userId : string, productId : string) : Observable<Users> {
          return this.http.put<Users>(`http://localhost:8081/api/users/${userId}/cart/update/${productId}`, {
          })
      }
  
      deleteUserCartItem (userId : string, productId : string) : Observable<any> {
          return this.http.delete(`http://localhost:8081/api/users/${userId}/cart/remove/${productId}`)
      }
      getCartItem (userId : string, productId : string) : Observable<CartItem> {
        return this.http.get<CartItem>(`http://localhost:8081/api/users/cart-items/${userId}/${productId}`)
    }
  }