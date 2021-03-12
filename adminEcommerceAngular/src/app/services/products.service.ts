import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';
import { Response } from   '../models/response';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private baseUrl =  `${environment.api + 'products?' + environment.api_key}`;
  private baseUrlUpdate = `${environment.api+'updateProducts.php'+'?API_KEY='+environment.api_key}`;


  constructor(private http: HttpClient) { }


  getProducts(): Observable<Response>{
    return this.http.get<Response>(this.baseUrl);

  }

  addProduct(product: Product): Observable<Response>{
    let params = new FormData();
    params.append('name', product.name);
    params.append('description', product.description);
    params.append('price','${product.price}');
    params.append('stock','${product.stock}');
    params.append('category','$(product.Category)');
    params.append('image', product.image);

    return this.http.post<Response>(this.baseUrl,params)
  }

  edditProduct(product: Product): Observable<Response>{
    const url = this.baseUrlUpdate+this.constructURLParams(product);
    return this.http.get<Response>(url);

    

  }



  constructURLParams = (object : any) => {
    let result = '';
    for (const property in object) {
        result += `&${property}=${object[property]}`;
    }
    return result;
  }



}


