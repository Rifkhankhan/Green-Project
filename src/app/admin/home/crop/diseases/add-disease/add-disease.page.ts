import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HomeService } from 'src/app/admin/service/home.service';
import { Crop } from 'src/app/models/crop.model';
import { Disease } from 'src/app/models/disease.model';

@Component({
  selector: 'app-add-disease',
  templateUrl: './add-disease.page.html',
  styleUrls: ['./add-disease.page.scss'],
})
export class AddDiseasePage implements OnInit {

  tipSub:Subscription
  diseases:Disease[];
  crop:Crop;
  isLoading = false
  cropSub:Subscription

  constructor(private loadCtrl: LoadingController,private homeService: HomeService,private router:Router,private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap=>{
      if(!paramMap.has('cropId'))
      {
        return
      }
      this.isLoading = true
      this.cropSub = this.homeService.getCrop(paramMap.get('cropId')).subscribe(crop=>{
        this.isLoading = false
        this.crop = crop
      })
    })
  }

  selectiveFile:File = null
  uploadfile(event)
  {
    console.log(this.selectiveFile =<File> event.target.files[0]);

    // if(event.target.files)
    // {
    //   var reader = new FileReader();
    //   reader.readAsDataURL(e.target.files[0]);
    //   reader.onload = (event:any)=>{
    //     this.url = event.target.result
    //   }
    // }
  }



  async SubmittedForm(form:NgForm)
  {
    if(!form.valid)
    {
      return
    }
    else
    {
      let formdata = new FormData();
      formdata.append('image',this.selectiveFile,this.selectiveFile.name);


      // './assets/images/{}/event.target.files[0]

      this.loadCtrl.create({
        message:"Creating...",
        animated:true,
        duration:2000,
        spinner:'bubbles',
      }).then(e=>{
        e.present()

        this.cropSub=this.homeService.addDisease(
          form.value.disease,
          form.value.adisease,
          this.crop.name,
          form.value.raction,
          `../assets/project_images/Disease/${this.crop.name}/${this.selectiveFile.name}`,

        ).subscribe(()=>{
          e.dismiss()
          this.router.navigate(["/admin",'tabs','home','diseases']);
        })
      })

    }



  }
}
