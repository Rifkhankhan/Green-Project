import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Router} from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthResponseData } from './auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private router: Router,private loadingCtrl:LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    ) { }

  isLoading = false;
  islogin =true;
  ngOnInit() {
  }

  // submittedForm(form:NgForm)
  // {
  //   if(!form.valid)
  //   {
  //     return;
  //   }


  //     const email = form.value.email;
  //     const password = form.value.password;
  //     this.router.navigateByUrl('');
  // }

  submittedForm(form:NgForm)
  {
    if(!form.valid)
    {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    this.authenticate(email,password);

  }

  authenticate(email: string, password: string) {
    this.isLoading = true;


    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();

        let authObs:Observable<AuthResponseData>;  // it observe singup and login

        if(this.islogin)
        {
          authObs=this.authService.login(email,password);
        }
        else
        {
          authObs=this.authService.signup(email, password)
        }
          authObs.subscribe(
          resData => {
            console.log(resData);
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl('/places/tabs/discover');
          },
          errRes => {
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message = 'Could not sign you up, please try again.';

            if (code === 'EMAIL_EXISTS') {
              message = 'This email address exists already!';
            }
            else if(code === 'EMAIL_NOT_FOUND')
            {
              message = "The input Email is not found"
            }
            else if(code === 'INVALID_PASSWORD')
            {
              message='The Password is Not Valid'
            }

            this.showAlert(message);
          }
        );
      });
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }
}
