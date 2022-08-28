import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
	AlertController,
	AnimationController,
	LoadingController,
	ModalController
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CropTips } from 'src/app/admin/models/croptips.models';
import { HomeService } from 'src/app/admin/service/home.service';
import { Crop } from 'src/app/models/crop.model';

@Component({
	selector: 'app-show-tip',
	templateUrl: './show-tip.page.html',
	styleUrls: ['./show-tip.page.scss']
})
export class ShowTipPage implements OnInit, OnDestroy {
	constructor(
		private animationCtrl: AnimationController,
		private loadCtrl: LoadingController,
		private modelCtrl: ModalController,
		private homeService: HomeService,
		private route: ActivatedRoute,
		private router: Router,
		private alertCtrl: AlertController
	) {}

	tipidSub: Subscription;
	deletSub: Subscription;
	cropTip: CropTips;
	isLoading = false;
	cropTipSub: Subscription;

	ngOnInit() {
		this.isLoading = true;

		this.tipidSub = this.route.paramMap.subscribe(paraMap => {
			if (!paraMap.has('tipId')) {
				return;
			}

			this.cropTipSub = this.homeService
				.getTip(paraMap.get('tipId'))
				.subscribe(tip => {
					this.cropTip = tip;
					this.isLoading = false;
				});
		});
	}

	doRefresh(event) {
		setTimeout(() => {
			this.isLoading = true;
			this.tipidSub = this.route.paramMap.subscribe(paraMap => {
				if (!paraMap.has('tipId')) {
					return;
				}

				this.cropTipSub = this.homeService
					.getTip(paraMap.get('tipId'))
					.subscribe(tip => {
						this.cropTip = tip;

						this.isLoading = false;
					});
			});

			event.target.complete();
		}, 2000);
	}

	ionViewWillEnter() {
		this.isLoading = true;
		this.tipidSub = this.route.paramMap.subscribe(paraMap => {
			if (!paraMap.has('tipId')) {
				return;
			}

			this.cropTipSub = this.homeService
				.getTip(paraMap.get('tipId'))
				.subscribe(tip => {
					this.cropTip = tip;

					this.isLoading = false;
				});
		});
	}

	cancelSub: Subscription;

	deleteTip(id: string) {
		this.alertCtrl
			.create({
				header: 'Do You Want to Delete',
				message: 'If you delete it will be removed',
				buttons: [
					{
						text: 'Okay',
						handler: () => {
							this.loadCtrl
								.create({
									message: 'Deleting...',
									animated: true,
									duration: 100,
									keyboardClose: false,
									spinner: 'circles'
								})
								.then(loadingEl => {
									loadingEl.present();
									this.deletSub = this.homeService
										.DeleteTip(id)
										.subscribe(() => {
											loadingEl.dismiss();
										});
								});
						}
					},
					{
						text: 'Cancel'
					}
				]
			})
			.then(e => {
				e.present();
			});

		this.router.navigate([
			'/admin',
			'tabs',
			'home',
			this.cropTip.name,
			'crop-tips'
		]);
	}

	ngOnDestroy() {
		if (this.cropTipSub || this.tipidSub || this.deletSub) {
			this.cropTipSub.unsubscribe();
			this.tipidSub.unsubscribe();
			this.deletSub.unsubscribe();
		}
	}
}
