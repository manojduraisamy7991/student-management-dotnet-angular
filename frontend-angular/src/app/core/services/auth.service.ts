import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { User, LoginCredentials, SignupCredentials, LoginResponse, SignupResponse } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(this.getStoredUser());
  readonly currentUser = this.currentUserSignal.asReadonly();

  constructor(private http: HttpClient) {}

  private getStoredUser(): User | null {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  }

  login(credentials: LoginCredentials): Observable<User> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      map(response => {
        const user: User = {
          id: '',
          email: credentials.email,
          name: '',
          token: response.token
        };
        return user;
      }),
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSignal.set(user);
      })
    );
  }

  signup(credentials: SignupCredentials): Observable<User> {
    return this.http.post<SignupResponse>(`${environment.apiUrl}/auth/signup`, credentials).pipe(
      map(response => {
        const user: User = {
          id: response.id,
          email: response.email,
          name: response.name
        };
        return user;
      }),
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSignal.set(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSignal.set(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSignal() !== null;
  }
}
