import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = "http://127.0.0.1:8000/resumeFinancier/"

  private apiUrl2 = "http://127.0.0.1:8000/resumeFinancier2/"

  private listUrl = "http://127.0.0.1:8000/transactions/"

  private sumUrl = "http://127.0.0.1:8000/resumeTransactions/"



  constructor(private http: HttpClient) { }

  getResume(access_token: string, year: number, month: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    });
  
    if (year == 0) {
      return this.http.get<any>(this.apiUrl, { headers });
    } else if (year != 0 && month == 0) {
      return this.http.get<any>(this.apiUrl + "?year=" + year, { headers });
    } else if (year != 0 && month != 0) {
      return this.http.get<any>(this.apiUrl + "?year=" + year + "&month=" + month, { headers });
    }
    return of(null); 
  }

  getResume2(access_token: string, year: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(this.apiUrl2 + "?year=" + year, { headers });
  }

  getTransactionList(access_token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(this.listUrl, { headers });
  }

  getTransactionsCount(access_token: string, year: number, month: number, type: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    });
    if (type) {
      if (year == 0) {
        return this.http.get<any>(this.sumUrl + "&type_transaction=" + type, { headers });
      } else if (year != 0 && month == 0) {
        return this.http.get<any>(this.sumUrl + "?year=" + year+ "&type_transaction=" + type, { headers });
      } else if (year != 0 && month != 0) {
        return this.http.get<any>(this.sumUrl + "?year=" + year + "&month=" + month + "&type_transaction=" + type, { headers });
      }
    }
    return of(null); 
  }
}
