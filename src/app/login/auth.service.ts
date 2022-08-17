import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map, take, tap, switchMap } from 'rxjs/operators';
import { Users } from '../models/users.model';
import { User } from './user.model';
import * as CryptoJS from 'crypto-js';

export interface AuthResponseData {
	idToken: string;
	// userId:string;
	localId: string;
	// registered?: boolean;
}
@Injectable({
	providedIn: 'root'
})
export class AuthService {
	constructor(private router: Router, private http: HttpClient) {}

	private _user = new BehaviorSubject<User>(null);
	// // private _userId = null;
	// private _users = new BehaviorSubject<Users[]>(null);

	// get getAllUsers() {
	// 	return this._users.asObservable();
	// }

	// fetchAllUsers() {
	// 	return this.http
	// 		.get<{ [key: string]: Users }>(
	// 			'https://greenproject-6f3b9-default-rtdb.firebaseio.com/users.json'
	// 		)
	// 		.pipe(
	// 			take(1),
	// 			map(data => {
	// 				const users = [];
	// 				for (const key in data) {
	// 					if (data.hasOwnProperty(key)) {
	// 						users.push({
	// 							userId: key,
	// 							userName: data[key].userName,
	// 							yourName: data[key].yourName,
	// 							password: this.decryptData(data[key].password),
	// 							mobile: data[key].mobile,
	// 							nic: this.decryptData(data[key].nic),
	// 							role: data[key].role,
	// 							address: data[key].address,
	// 							registerd: data[key].registerd,
	// 							token: this.decryptData(data[key].token),
	// 							zone: data[key].zone
	// 						});
	// 					}
	// 				}

	// 				return users;
	// 			}),
	// 			tap(data => {
	// 				this._users.next(data);
	// 			})
	// 		)
	// 		.subscribe(users => {
	// 			console.log(users);
	// 		});
	// }

	get isAuthenticated() {
		return this._user.asObservable().pipe(
			map(user => {
				if (user) {
					return !!user.token;
				} else {
					return false;
				}
			})
		);
	}

	// get getUserId()
	// {
	//   return this._userId;
	// }

	get getUserId() {
		return this._user.asObservable().pipe(
			map(user => {
				if (user) {
					return user.id;
				} else {
					return null;
				}
			})
		);
	}
	login(userName: string, password: string) {
		// this._isAuthenticated = true;
		// this.router.navigateByUrl('/places/tabs/discover')

		// var theDataToAdd = userName;
		// var usersRef = new Firebase(
		// 	'https://greenproject-6f3b9-default-rtdb.firebaseio.com/users/'
		// );

		// usersRef.child(theDataToAdd).once('value', function(snapshot) {
		// 	if (snapshot.exists()) {
		// 		alert('exists');
		// 	}
		// });

		return this.http
			.get<{ [key: string]: Users }>(
				`https://greenproject-6f3b9-default-rtdb.firebaseio.com/users.json?orderBy="username"&equalTo="${userName}"`
			)
			.pipe(
				take(1),
				map(data => {
					if (Object.keys(data).length === 1) {
						let user = {};
						for (const key in data) {
							if (data.hasOwnProperty(key)) {
								if (this.decryptData(data[key].password) === password) {
									user = {
										userId: data[key].userId,
										username: data[key].userName,
										yourname: data[key].yourName,
										mobile: data[key].mobile,
										nic: this.decryptData(data[key].nic),
										address: data[key].address,
										zone: data[key].zone,
										password: this.decryptData(data[key].password),
										role: data[key].role,
										token: data[key].token,
										registered: true
									};

									return user;
								} else {
									throw new Error('Password is not Correct');
								}
							} else {
								throw new Error('UserName is not Correct');
							}
						}
					} else {
						throw new Error('Your Password or UserName is not Correct');
					}
				})
			);
	}

	logout() {
		// this._isAuthenticated = false
		this._user.next(null);
		this.router.navigateByUrl('/auth');
	}

	encryptKey = 'greenProject';
	encryptData(data) {
		try {
			return CryptoJS.AES
				.encrypt(JSON.stringify(data), this.encryptKey)
				.toString();
		} catch (e) {
			console.log(e);
		}
	}

	decryptData(data) {
		try {
			const bytes = CryptoJS.AES.decrypt(data, this.encryptKey);
			if (bytes.toString()) {
				return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
			}
			return data;
		} catch (e) {
			console.log(e);
		}
	}

	signup(
		userName: string,
		yourName: string,
		mobile: string,
		nic: string,
		address: string,
		zone: string,
		password: string
	) {
		const encPassword = this.encryptData(password);
		const encNic = this.encryptData(nic);
		const token = this.encryptData(Math.random().toString());

		const newuser = {
			userId: Math.random().toString(),
			username: userName,
			yourname: yourName,
			mobile: mobile,
			nic: encNic,
			address: address,
			zone: zone,
			password: encPassword,
			role: 'farmer',
			token: token,
			registered: true
		};
		return this.http
			.post<{
				name: string;
			}>('https://greenproject-6f3b9-default-rtdb.firebaseio.com/users.json', {
				...newuser,
				userId: null
			})
			.pipe(tap(this.setUserData.bind(this)));
	}

	private storeAuthData(
		userId: string,
		token: string
		// tokenExpirationDate: string,
		// email: string
	) {
		const data = JSON.stringify({
			userId: userId,
			token: token
			// tokenExpirationDate: tokenExpirationDate,
			// email: email
		});

		// Plugins.Storage.set({ key: 'authData', value: data });
	}

	private setUserData(userData: AuthResponseData) {
		// const expirationTime = new Date(
		//   // new Date().getTime() + +userData.expiresIn * 1000
		// );

		console.log(userData);

		this._user.next(
			new User(
				userData.localId,
				// userData.email,
				userData.idToken
				// expirationTime
			)
		);

		this.storeAuthData(
			userData.localId,
			userData.idToken
			// expirationTime.toISOString(),
			// userData.email
		);
	}
}
