import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Auth } from '../../providers/auth/auth';
import { Networks } from '../../providers/network/network';
import { HomePage } from '../home/home';

@Component({
  selector: 'login',
  templateUrl: './login.html',

  animations: [
        //For the logo
        trigger('flyInBottomSlow', [
          state('in', style({
            transform: 'translate3d(0,0,0)'
          })),
          transition('void => *', [
            style({transform: 'translate3d(0,2000px,0'}),
            animate('2000ms ease-in-out')
          ])
        ]),
     
        //For the background detail
        trigger('flyInBottomFast', [
          state('in', style({
            transform: 'translate3d(0,0,0)'
          })),
          transition('void => *', [
            style({transform: 'translate3d(0,2000px,0)'}),
            animate('1000ms ease-in-out')
          ])
        ]),
     
        //For the login form
        trigger('bounceInBottom', [
          state('in', style({
            transform: 'translate3d(0,0,0)'
          })),
          transition('void => *', [
            animate('2000ms 200ms ease-in', keyframes([
              style({transform: 'translate3d(0,2000px,0)', offset: 0}),
              style({transform: 'translate3d(0,-20px,0)', offset: 0.9}),
              style({transform: 'translate3d(0,0,0)', offset: 1}) 
            ]))
          ])
        ]),
     
        //For login button
        trigger('fadeIn', [
          state('in', style({
            opacity: 1
          })),
          transition('void => *', [
            style({opacity: 0}),
            animate('1000ms 2000ms ease-in')
          ])
        ])
    ]
})

export class LoginPage {
 
    loginForm: FormGroup;
    forgotPasswordForm: FormGroup;
    loading: any;
    logoState: any = "in";
    cloudState: any = "in";
    loginState: any = "in";
    formState: any = "in";
    errorMessage: string = "";
    submitAttempt: Boolean = false;
    isForgotPassword: Boolean = false;

    constructor(
      public navCtrl: NavController, 
      public authService: Auth, 
      public loadingCtrl: LoadingController,
      public formBuilder: FormBuilder,
      public networkService: Networks
    ) {

        if (this.networkService.noConnection()) {
          this.networkService.showNetworkAlert();
        }

        this.loginForm = formBuilder.group({
          email: ['', Validators.compose([Validators.maxLength(30), Validators.pattern("[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?"), Validators.required])],
          password: ['', Validators.compose([Validators.required])],
        });
        this.forgotPasswordForm = formBuilder.group({
          email: ['', Validators.compose([Validators.maxLength(30), Validators.pattern("[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?"), Validators.required])]
        });

        this.loginForm.valueChanges.subscribe(data => {
          this.loginForm.setValue({
            email: (data.email).toLowerCase(),
            password: data.password
          },
          {emitEvent: false});
        });

        this.forgotPasswordForm.valueChanges.subscribe(data => {
          this.forgotPasswordForm.setValue({
            email: (data.email).toLowerCase()
          },
          {emitEvent: false});
        });
    }
 
    ionViewDidLoad() {
        this.showLoader();
        //Check if already authenticated
        this.authService.checkAuthentication().then((res) => {
            if (res == null) {
              console.log("Not already authorized");
              this.loading.dismiss();
            }
            else if(Object.keys(res).length === 0) {
              console.log("Not already authorized");
              this.loading.dismiss();
            } else {
              console.log("Already authorized");
              this.loading.dismiss();
              this.navCtrl.setRoot(HomePage);
            }
        }, (err) => {
            console.log("Not already authorized");
            this.loading.dismiss();
        });
    }
 
    login(){
        this.showLoader();
        this.submitAttempt = true;
        let credentials = {
            email: this.loginForm.value.email,
            password: this.loginForm.value.password
        };
        if(this.loginForm.valid) {
            this.authService.login(credentials).then((result) => {
                  this.loading.dismiss();
                  console.log(result);
                  this.navCtrl.setRoot(HomePage);
            }, (err) => {
                this.errorMessage = "Authentication Failed!"
                this.loading.dismiss();
                console.log(err);
            });
        }
        else {
            this.errorMessage = "Please fill all details correctly";
            this.loading.dismiss();
        }
    }

    submitForgotPassword() {
        this.showLoader();
        this.submitAttempt = true;
        let credentials = {
            email: this.forgotPasswordForm.value.email,
        };
        if(this.forgotPasswordForm.valid) {
            this.authService.forgotPassword(credentials).then((result) => {
                this.loading.dismiss();
                console.log(result);
                this.isForgotPassword = !this.isForgotPassword; 
                this.errorMessage = "Please check your mail for further information!"
            }, (err) => {
                this.errorMessage = "Authentication Failed!";
                this.loading.dismiss();
                console.log(err);
            });
        }
        else {
            this.errorMessage = "Please fill all details correctly";
            this.loading.dismiss();
        }
    }
 
    showLoader(){
        this.loading = this.loadingCtrl.create({
            content: 'Authenticating...'
        });
        this.loading.present();
    }

    forgotPassword(){
      this.isForgotPassword = !this.isForgotPassword; 
    }
 
}