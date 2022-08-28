import { Preferences } from '@capacitor/preferences';
import { Injectable, OnInit } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable, Subscription, of } from 'rxjs';
import { take, tap, switchMap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanLoad, OnInit {
	constructor(private authService: AuthService, private router: Router) {}
	userData: any;

	ngOnInit() {
		Preferences.get({ key: 'userData' }).then(data => {
			this.userData = data.value;
		});
	}
	authSub: Subscription;


	canLoad(
		route: Route,
		segments: UrlSegment[]
	):
		| boolean
		| UrlTree
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree> {
      return this.authService.isAuthenticated.pipe(
        take(1),
        switchMap(isAuthenticated=>{
          if(!isAuthenticated){
            return this.authService.autoLogin()
          }
          else{
            return of(isAuthenticated)
          }
        }),
        tap(isAuthenticted=>{
          if(!isAuthenticted){
            this.router.navigateByUrl('/login')
          }
        })
      )
    }

	ngOnDestroy(): void {
		if (this.authSub) {
			this.authSub.unsubscribe();
		}

	}
}
