import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimationController, LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CropTips } from 'src/app/admin/models/croptips.models';
import { Disease } from 'src/app/admin/models/disease.model';
import { HomeService } from 'src/app/admin/service/home.service';
import { Crop } from 'src/app/models/crop.model';

@Component({
  selector: 'app-diseases',
  templateUrl: './diseases.page.html',
  styleUrls: ['./diseases.page.scss'],
})
export class DiseasesPage implements OnInit {
  constructor(private animationCtrl: AnimationController,
    private loadCtrl:LoadingController,
    private modelCtrl: ModalController,private homeService:HomeService,private route:ActivatedRoute) { }

  tipSub:Subscription
  diseases:Disease[];
  crop:Crop;
  isLoading = false
  cropSub:Subscription

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
    this.tipSub = this.homeService.fetchAllDisease(this.crop.name).subscribe(diseases=>{
      this.diseases = diseases
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
