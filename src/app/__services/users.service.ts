import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Program } from "app/models/Program";
import { Users } from "app/models/Users";
import { environment } from "environments/environment";
import { Token } from "prismjs";
import { Observable } from "rxjs";


const AUTH_API = 'http://localhost:8081/';


@Injectable({
    providedIn: 'root'
  })

  export class UsersService {
      constructor(private http : HttpClient) { }
  
     
      getUsers () : Observable<Users[]> {
          return this.http.get<Users[]>(AUTH_API +`api/users`);
      }
  
      geteventsParticipated (id : string) : Observable<Program[]> {
          return this.http.get<Program[]>(AUTH_API +`api/users/eventsParticipated/${id}`);
      }
      getUser (id : string) : Observable<Users> {
        return this.http.get<Users>(AUTH_API +`api/users/${id}`);
    }
    geteventsAdded (id : string) : Observable<any[]> {
        return this.http.get<any[]>(AUTH_API +`api/users/eventsAdded/${id}`);
    }
    addImage(userId : string, value: any): Observable<Object> {
        return this.http.post(AUTH_API +`api/users/image/${userId}`, value);
      }
  
     
  
      
  }