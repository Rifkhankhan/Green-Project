import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { HomeService } from 'src/app/admin/service/home.service';
import { Crop } from 'src/app/models/crop.model';

@Component({
  selector: 'app-addtip',
  templateUrl: './addtip.page.html',
  styleUrls: ['./addtip.page.scss'],
})
export class AddtipPage implements OnInit {

  constructor(private model:ModalController,private route:ActivatedRoute,private homeService: HomeService,private router: Router) { }

  crop:Crop;
  cropSub:Subscription
  ngOnInit() {

    this.cropSub = this.route.paramMap.subscribe(paramMap=>{
      if(!paramMap.has('cropId'))
      {
        return
      }

      this.cropSub = this.homeService.getCrop(paramMap.get('cropId')).subscribe(crop=>{
        this.crop = crop
        console.log(crop);

      })
    })

  }



  submittedForm(form:NgForm)
  {
    this.cropSub = this.homeService.addTips(this.crop.name,form.value.information).subscribe(()=>{
      this.router.navigate(['/admin','tabs','home'])
    })
  }

  ngOnDestroy()
  {
    if(this.cropSub)
    {
      this.cropSub.unsubscribe()
    }
  }
}
