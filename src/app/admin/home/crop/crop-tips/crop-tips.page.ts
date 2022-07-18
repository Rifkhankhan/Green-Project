import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AnimationController, LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CropTips } from 'src/app/admin/models/croptips.models';
import { HomeService } from 'src/app/admin/service/home.service';
import { Crop } from 'src/app/models/crop.model';
import { AddtipPage } from './addtip/addtip.page';

@Component({
  selector: 'app-crop-tips',
  templateUrl: './crop-tips.page.html',
  styleUrls: ['./crop-tips.page.scss'],
})
export class CropTipsPage implements OnInit,OnDestroy{

  constructor(private animationCtrl: AnimationController,
    private loadCtrl:LoadingController,
    private modelCtrl: ModalController,private homeService:HomeService,private route:ActivatedRoute) { }

  tipSub:Subscription
  cropTips:CropTips[];
  crop:Crop;
  isLoading = false
  cropSub:Subscription

  sowTips:CropTips[];
  csowTips:CropTips[];

  ngOnInit() {
    this.isLoading = true

    this.route.paramMap.subscribe(paraMap=>{
      if(!paraMap.has('cropId'))
      {
        return
      }

      this.cropSub = this.homeService.getCrop(paraMap.get('cropId')).subscribe(crop=>{
        this.crop = crop

      })

    })
  }

  ionViewWillEnter()
  {
    this.isLoading = true
    this.tipSub = this.homeService.fetchAlltips(this.crop.name).subscribe(tips=>{
      this.cropTips = tips
      this.isLoading = false
    })
  }









  ngOnDestroy()
  {
    if(this.tipSub)
    {
      this.tipSub.unsubscribe()
    }
  }


}

