import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Crop } from 'src/app/models/crop.model';
import { Disease } from 'src/app/models/disease.model';
import { HomeService } from '../../HomeServices/home.service';

@Component({
  selector: 'app-fertilizer-calculator',
  templateUrl: './fertilizer-calculator.page.html',
  styleUrls: ['./fertilizer-calculator.page.scss'],
})
export class FertilizerCalculatorPage implements OnInit {


  constructor(private homeService: HomeService,private route: ActivatedRoute,private router: Router) { }

  tipSub:Subscription
  idSub:Subscription
  diseases:Disease[];
  crop:Crop;
  isLoading = false
  cropSub:Subscription

  ngOnInit() {
    this.isLoading = true

    this.idSub = this.route.paramMap.subscribe(paraMap=>{
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
      console.log(this.crop.name);


      this.isLoading = false
    })
  }

  about(id:string)
  {
    this.router.navigate(['/dashboard','tabs','home',this.crop.name,'diseases','about-disease',id]);
  }

  remedy(id:string)
  {
    this.router.navigate(['/dashboard','tabs','home',this.crop.name,'diseases','remedy-disease',id]);

  }


  ngOnDestroy()
  {
    if(this.tipSub ||this.idSub)
    {
      this.tipSub.unsubscribe()
      this.idSub.unsubscribe()
    }
  }

}
