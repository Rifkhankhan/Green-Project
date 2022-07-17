import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Crop } from 'src/app/models/crop.model';
import { HomeService } from './HomeServices/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private homeService:HomeService) { }

  crops:Crop[];

  cropsSub:Subscription;

  ngOnInit() {

    this.cropsSub = this.homeService.Allcrops.subscribe(crops=>{
      this.crops = crops
    })


  }

}
