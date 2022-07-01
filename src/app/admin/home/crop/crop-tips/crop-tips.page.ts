import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AnimationController, LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CropTips } from 'src/app/admin/models/croptips.models';
import { HomeService } from 'src/app/admin/service/home.service';
import { AddtipPage } from './addtip/addtip.page';

@Component({
  selector: 'app-crop-tips',
  templateUrl: './crop-tips.page.html',
  styleUrls: ['./crop-tips.page.scss'],
})
export class CropTipsPage implements OnInit,OnDestroy{

  constructor(private animationCtrl: AnimationController,
    private loadCtrl:LoadingController,
    private modelCtrl: ModalController,private homeService:HomeService) { }

  tipSub:Subscription
  cropTips:CropTips[];
  isLoading = false

  ngOnInit() {
    this.isLoading = true
    this.tipSub = this.homeService.AllcropTips.subscribe(tips=>{
      this.cropTips = tips
      this.isLoading = false
    })
  }

  ionViewWillEnter()
  {
    this.isLoading = true
    this.tipSub = this.homeService.fetchAlltips().subscribe(tips=>{
      this.cropTips = tips
      this.isLoading = false
    })
  }

   addCropTips()
  {
      this.modelCtrl.create({
        component: AddtipPage
      }).then(el=>{
        el.present();
        return el.onDidDismiss()
      }).then(data=>{

          this.loadCtrl.create({
            message:"Adding...",
            duration:2000
          }).then(el=>{
            el.present()
            this.homeService.addTips(
              data.data.Title,
              data.data.Subtitle,
              data.data.information
             ).subscribe(()=>{
              el.dismiss()

             })
          })
      })

  }

   close(){
     this.modelCtrl.dismiss(this.taskObj);
  }

  taskObj;


  ngOnDestroy()
  {
    if(this.tipSub)
    {
      this.tipSub.unsubscribe()
    }
  }


}
