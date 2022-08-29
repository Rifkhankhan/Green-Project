import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import {
	AlertController,
	IonItemSliding,
	LoadingController
} from '@ionic/angular';
import { Subscription } from 'rxjs';

import { NotificationService } from 'src/app/admin/service/notification.service';

@Component({
	selector: 'app-notification',
	templateUrl: './notification.page.html',
	styleUrls: ['./notification.page.scss']
})
export class NotificationPage implements OnInit, OnDestroy {
	constructor(
		private notificationService: NotificationService,
		private loadCtrl: LoadingController,
		private alertCtrl: AlertController
	) {}

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

	edit(id: string) {
		console.log(id);
	}
	deleteSub: Subscription;

	delete(id: string, item: IonItemSliding) {
		this.alertCtrl
			.create({
				header: 'Delete This Message!',
				message: 'Do You Want to Delete?',
				buttons: [
					{
						text: 'OK',
						handler: () => {
							item.close();

							this.loadCtrl
								.create({
									message: 'Deleting...',
									animated: true,
									duration: 500,
									spinner: 'bubbles'
								})
								.then(el => {
									el.present();
									this.deleteSub = this.notificationService
										.deleteNotification(id)
										.subscribe(() => {
											el.dismiss();
										});
								});
						}
					},
					{
						text: 'Cancel',
						handler: () => {
							item.close();
						}
					}
				]
			})
			.then(e => {
				e.present();
			});
	}

	ngOnDestroy() {
		if (this.notiSub|| this.deleteSub) {
			this.notiSub.unsubscribe;
			this.deleteSub.unsubscribe;
		}
	}
}
