import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-addtip',
  templateUrl: './addtip.page.html',
  styleUrls: ['./addtip.page.scss'],
})
export class AddtipPage implements OnInit {

  constructor(private model:ModalController) { }

  ngOnInit() {
  }
  taskObj;

   close(){
     this.model.dismiss(this.taskObj);
  }

  submittedForm(form:NgForm)
  {
    if(!form.valid)
    {
      return
    }
    this.taskObj = {
      Title:form.value.title,
      Subtitle:form.value.stitle,
      information:form.value.discription
    }



    this.close()
  }
}
