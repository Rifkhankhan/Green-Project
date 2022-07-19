import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './user.model';


export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router,private http:HttpClient){}

  private _user = new BehaviorSubject<User>(null);
  // private _userId = null;

  get isAuthenticated()
  {
    return this._user.asObservable().pipe(map(user=>{
      if(user)
      {
        return !!user.token
      }
      else
      {
        return false;
      }
    }));
  }

  // get getUserId()
  // {
  //   return this._userId;
  // }

  get getUserId()
  {
    return this._user.asObservable().pipe(map(user=>{
      if(user)
      {
        return user.id
      }
      else
      {
        return null;
      }
    }))
  }
  login(email:string,password:string)
  {
    // this._isAuthenticated = true;
    // this.router.navigateByUrl('/places/tabs/discover')
     return this.http.
     post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
     {email:email,password:password,returnSecureToken:true})
     .pipe(tap(this.setUserData.bind(this)));
  }

  logout()
  {
    // this._isAuthenticated = false
    this._user.next(null);
        this.router.navigateByUrl('/auth')
  }


  signup(email:string,password:string)
  {
     return  this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
     { email: email, password: password, returnSecureToken: true })
     .pipe(tap(this.setUserData.bind(this)));
  }


  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string
  ) {
    const data = JSON.stringify({
      userId: userId,
      token: token,
      tokenExpirationDate: tokenExpirationDate,
      email: email
    });

    // Plugins.Storage.set({ key: 'authData', value: data });
  }

private setUserData(userData: AuthResponseData) {
  const expirationTime = new Date(
    new Date().getTime() + +userData.expiresIn * 1000
  );

  this._user.next(
    new User(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime
    )
  );


  this.storeAuthData(
    userData.localId,
    userData.idToken,
    expirationTime.toISOString(),
    userData.email
  );
}
}

