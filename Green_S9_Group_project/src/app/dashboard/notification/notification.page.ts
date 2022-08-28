import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { NotificationService } from 'src/app/admin/service/notification.service';

@Component({
	selector: 'app-notification',
	templateUrl: './notification.page.html',
	styleUrls: ['./notification.page.scss']
})
export class NotificationPage implements OnInit, OnDestroy {
	constructor(private notificationService: NotificationService) {}

	notifications: Notification[];
	notiSub: Subscription;
	isLoading = false;
	ngOnInit() {
		this.isLoading = true;
		this.notiSub = this.notificationService.AllNotification.subscribe(
			notification => {
				this.notifications = notification;
				this.isLoading = false;
			}
		);
	}

	ionViewWillEnter() {
		this.isLoading = true;

		this.notiSub = this.notificationService
			.fetchAllNotifications()
			.subscribe(notifications => {
				this.notifications = notifications;
				this.isLoading = false;
			});
	}

	ngOnDestroy() {
		if (this.notiSub) {
			this.notiSub.unsubscribe;
		}
	}

}
