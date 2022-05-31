import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ImageService {
    private baseUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient,
    ) { }

  getImage(name : string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get/image/${name}`);
}
addImage(name : string): Observable<any> {
  return this.http.get<any>(`/upload/image`);
}

 
}