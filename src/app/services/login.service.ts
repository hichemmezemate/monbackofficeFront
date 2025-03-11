import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private isAuth = false

  private apiUrl = "http://127.0.0.1:8000/api/token/";

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const body = { username, password };

    return this.http.post<any>(this.apiUrl, body).pipe(
      tap(response => {
        if (response.access) {
          this.isAuth = true;
        }
      }),
      catchError(this.handleError)
    );
  }

  isAuthenticated(): boolean {
    return this.isAuth;
  }

  logout(): void {
    this.isAuth = false;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error (${error.status}): ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
