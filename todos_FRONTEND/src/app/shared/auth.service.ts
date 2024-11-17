import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, tap } from 'rxjs';
import { JWTService } from './jwt.service';
import { APIURL } from '../enviroments/apiurl';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  picture: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser$ = new BehaviorSubject<User | null>(null);
  currentUser$ = this._currentUser$.asObservable();

  private _loading$ = new BehaviorSubject<boolean>(false);
  loading$ = this._loading$.asObservable();

  constructor(
    private jwtSrv: JWTService,
    private http: HttpClient,
    private router: Router
  ) {
    this.fetchUser();
  }

  isLoggedIn() {
    return this.jwtSrv.hasToken();
  }

  login(username: string, password: string) {
    return this.http
      .post<{ user: User; token: string }>(`${APIURL}/api/login`, {
        username,
        password,
      })
      .pipe(
        tap((res) => this.jwtSrv.setToken(res.token)),
        tap((res) => this._currentUser$.next(res.user)),
        map((res) => res.user)
      );
  }

  logout() {
    this.jwtSrv.removeToken();
    this._currentUser$.next(null);
    this.router.navigate(['/']);
  }

  public fetchUser() {
    this._loading$.next(true);
    this.http
      .get<User>(`${APIURL}/api/users/me`)
      .pipe(
        tap((user) => this._currentUser$.next(user)),
        tap(() => this._loading$.next(false)),
        tap({
          error: (error) => {
            console.error('Failed to fetch user', error);
            this._loading$.next(false);
          },
        })
      )
      .subscribe();
  }

  register(
    firstName: string,
    lastName: string,
    username: string,
    picture: string,
    password: string,
    confirmPassword: string
  ) {
    return this.http.post(`${APIURL}/api/register`, {
      firstName,
      lastName,
      username,
      password,
      confirmPassword,
      picture,
    });
  }
}
