import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {tap,take,map, switchMap, catchError} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getAllProducts: any;
  _products: any;

  constructor(private http:HttpClient) { }
  readonly url = "http://localhost:8100/users";

  private _users = new BehaviorSubject([])

  getAllUser()
  {
    return this._users.asObservable();
  }

  logup(
    username:string,
    yourname:string,
    mobile:string,
    nic:string,
    address:string,
    zone:string,
    password:string
  ){

    let genId:string;

    const newuser = {
      userId:Math.random().toString(),
      username:username,
      yourname:yourname,
      mobile:mobile,
      nic:nic,
      address:address,
      zone:zone,
      password:password,
      role:'farmer'
    };

    return  this.http.post<{name:string}>("https://greenproject-6f3b9-default-rtdb.firebaseio.com/users.json",{...newuser})
  }

  login(username:string,password:string)
  {

  }
}

