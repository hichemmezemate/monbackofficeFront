import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = "http://127.0.0.1:8000/infoproducts/";

  private editUrl = "http://127.0.0.1:8000/editproduct/"

  constructor(private http: HttpClient) { }

  getProducts(access_token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`
    });
    return this.http.get<any>(this.apiUrl, { headers });
  }

  getPoissons(access_token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`
    });
    return this.http.get<any>(this.apiUrl+"poissons", { headers });
  }

  getCrustaces(access_token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`
    });
    return this.http.get<any>(this.apiUrl+"crustaces", { headers });
  }

  getFruitsDeMer(access_token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`
    });
    return this.http.get<any>(this.apiUrl+"fruitsdemer", { headers });
  }

  editQuantities(access_token: string, body: any[]): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.post<any>(this.editUrl, body, { headers });
  }
}
