import { Router } from '@angular/router';
import { AuthService } from 'src/app/login/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.page.html',
	styleUrls: ['./admin.page.scss']
})
export class AdminPage implements OnInit {
	constructor(private authService: AuthService, private router: Router) {}

	ngOnInit() {}

	logout() {
		this.authService.logout();
		this.router.navigateByUrl('/login');
	}

}
