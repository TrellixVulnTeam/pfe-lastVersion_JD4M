import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Feedback } from 'app/models/Feedback';
import { Program } from 'app/models/Program';
import { Users } from 'app/models/Users';
import { BehaviorSubject, Observable } from 'rxjs';

//const API_URL = 'http://localhost:8081';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
    private baseUrl = 'http://localhost:8081/api/events';
    onProductChanged: BehaviorSubject<any>;
    onCategoriesChanged: BehaviorSubject<any>;
    choixmenu : string  = 'A';
    listData : Program[];
    public dataForm:  FormGroup;
    private baseUrl2 = '/api/articles';
    private reloadFeedback$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private http : HttpClient) {
        this.onProductChanged = new BehaviorSubject({});
        this.onCategoriesChanged = new BehaviorSubject({});
     }

    getProducts () : Observable<Program[]> {
        return this.http.get<Program[]>(`${this.baseUrl}/all`);
    }
    getPendingProducts () : Observable<Program[]> {
      return this.http.get<Program[]>(`${this.baseUrl}/all/pending`);
  }
    getProduct (id : string) : Observable<Program> {
        return this.http.get<Program>(`${this.baseUrl}/all/${id}`);
    }
    getPendingProduct (id : string) : Observable<Program> {
      return this.http.get<Program>(`${this.baseUrl}/pending/${id}`);
  }
    addToCart (userId : string,program: Object) : Observable<Object> {
        return this.http.post<Object>(`${this.baseUrl}/add/${userId}`, program);
    }
    getOrganizer (id : string) : Observable<Users> {
        return this.http.get<Users>(`${this.baseUrl}/all/organizer/${id}`);
    }
    getPartcipants (id : string) : Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/participant/${id}`);
    }
    getPendingPartcipants (id : string) : Observable<any> {
      return this.http.get<any>(`${this.baseUrl}/pending/participant/${id}`);
  }
    
      createEvent(program: Object): Observable<Object> {
        return this.http.post(`${this.baseUrl}/add`, program);
      }
      addProduct(program): Promise<any>
      {
          return new Promise((resolve, reject) => {
              this.http.post(`${this.baseUrl}/add`, program)
                  .subscribe((response: any) => {
                      resolve(response);
                  }, reject);
          });
      }
    
      updateEvent(id: string, value: any): Observable<Object> {
        return this.http.put(`${this.baseUrl}/put/${id}`, value);
      }
      addParticipant(id: string,productId : string, value: any): Observable<Object> {
        return this.http.post(`${this.baseUrl}/all/${id}/${productId}`, value);
      }
      addPendingParticipant(id: string,productId : string, value: any): Observable<Object> {
        return this.http.post(`${this.baseUrl}/all/${id}/addPending/${productId}`, value);
      }
      addPlace(productId : string, value: any): Observable<Object> {
        return this.http.post(`${this.baseUrl}/all/place/${productId}`, value);
      }
    
    
      deleteEvent(id: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });
      }

      ChangeStatus(id: string, productId : string): Observable<any> {
        return this.http.post(`${this.baseUrl}/changeStatus/${id}/pending/${productId}`, { responseType: 'text' });
      }


      resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
      {
          return new Promise<void>((resolve, reject) => {
  
              Promise.all([
                  //this.getCourses()
              ]).then(
                  () => {
                      resolve();
                  },
                  reject
              );
          });
      }
  
    
    

      ////////////////////////////
      ////////////////////////////
      /////////////////////
      /////////////////////////////////////
      ////////////////////////////////////
      /////////////////////////////////

   
      getAll(): Observable<any> {
       
        return this.http.get(`${this.baseUrl2}`);
      }
    
    
      uploadFile(file: File): Observable<HttpEvent<{}>> {
            const formdata: FormData = new FormData();
            formdata.append('file', file);
            const req = new HttpRequest('POST', '<Server URL of the file upload>', formdata, {
                  reportProgress: true,
                  responseType: 'text'
            });
        
            return this.http.request(req);
       }
       addImage(productId : string, value: any): Observable<Object> {
        return this.http.post(`${this.baseUrl}/all/image/${productId}`, value);
      }

      validateCart(cardNumber : string): Observable<Object> {
        return this.http.get(`http://localhost:8082/api/card/${cardNumber}`);
      }

      DecreaseAmountCard(cardNumber : string, amount : number ): Observable<Object> {
        return this.http.post(`http://localhost:8082/api/card/amount/${cardNumber}/${amount}`, cardNumber);
      }

      IncreaseAmountCard(productId : string, amount : number ): Observable<Object> {
        return this.http.post(`${this.baseUrl}/add/card/amount/${productId}/${amount}`, productId);
      }

      addICardToEvent(cardNumber : string,productId : string): Observable<Object> {
        return this.http.post(`${this.baseUrl}/add/${cardNumber}/${productId}`, cardNumber);
      }

      addChatToEvent(productId : string, userId: string, message : string): Observable<Object> {
        return this.http.post(`${this.baseUrl}/add/chat/${productId}/${userId}`, message);
      }

      getchatRoomByEvent(productId : string): Observable<Program> {
        return this.http.get<Program>(`${this.baseUrl}/get/chat/${productId}`);
    }

    getRecommendation(productId : string): Observable<Program> {
      return this.http.get<Program>(`http://127.0.0.1:5000/products?id=${productId}`);
  }

  AddFeedback(productId : string, userId : string , feedback : Feedback): Observable<Object> {
    return this.http.post(`${this.baseUrl}/add/feedback/${productId}/${userId}`, feedback);
  }
  getFeedbacks(productId : string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get/feedback/${productId}`);

 } 

 setReloadFeedback(value: Boolean) {
  this.reloadFeedback$.next(value);
 }  

 getReloadFeedback() {
  return this.reloadFeedback$.asObservable();
 }



    }
  
  
  
    
