import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private baseUrl =  `${environment.api + 'category?' + environment.api_key}`;

  constructor(private http: HttpClient) { }

  getCategory(): Observable<Response>{
    return this.http.get<Response>(this.baseUrl);
  }
}
