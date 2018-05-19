import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';

import { Auth } from '../../providers/auth/auth';
import { HomePage } from '../home/home';

import * as _ from 'lodash'
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {

  public loader: any;
  public users: any;
  public list_users: Boolean = true;
  public create_users: Boolean = false;
  public edit_users: Boolean = false;
  public view_users: Boolean = false;
  public selected_user: any; 
  public userForm: any;
  public _id: String = '';

  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      public modalCtrl: ModalController, 
      public alertCtrl: AlertController, 
      public authService: Auth, 
      public loading: LoadingController,
      public storage: Storage,
      public toastCtrl: ToastController,
      public CallNumber: CallNumber,
      public formBuilder: FormBuilder
  ) { 
    this.userForm = formBuilder.group({
        aadhaar_no: ['', Validators.compose([Validators.required])],
        address: [''],
        alternate_no: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*'), Validators.required])],
        email: ['', Validators.compose([Validators.maxLength(30), Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"), Validators.required])],
        esi_no: [''],
        firstName: ['', Validators.compose([Validators.required])],
        lastName: ['', Validators.compose([Validators.required])],
        password: ['', Validators.compose([Validators.required])],
        pan_no: [''],
        pf_no: [''],
        phone_no: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*'), Validators.required])],
        roles: ['', Validators.compose([Validators.required])],
        user_type: ['', Validators.compose([Validators.required])],
        username: ['', Validators.compose([Validators.required])]
    });
  }

  resetUser() {
        this.userForm.controls['aadhaar_no'].setValue('');
        this.userForm.controls['address'].setValue('');
        this.userForm.controls['alternate_no'].setValue('');
        this.userForm.controls['email'].setValue('');
        this.userForm.controls['esi_no'].setValue('');
        this.userForm.controls['firstName'].setValue('');
        this.userForm.controls['lastName'].setValue('');
        this.userForm.controls['password'].setValue('');
        this.userForm.controls['pan_no'].setValue('');
        this.userForm.controls['pf_no'].setValue('');
        this.userForm.controls['phone_no'].setValue('');
        this.userForm.controls['roles'].setValue('user');
        this.userForm.controls['user_type'].setValue("permanent");
        this.userForm.controls['username'].setValue("");
  }

  ionViewDidLoad() {
    this.loader = this.loading.create({
      content: 'Please wait...',
    });
    this.authService.searchUser().then((data) => {
      this.users = data;
      for(var i = 0; i < this.users.length; i++) {
        this.users[i].profileImageURL = "http://localhost:3000" + this.users[i].profileImageURL;
      }
    }, (err) => {
        console.log("not allowed");
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
 
  callNumber(num) {
      this.CallNumber.callNumber(num, false)
        .then(() => console.log('Launched dialer!'))
        .catch(() => console.log('Error launching dialer'));
  }

  create() {
        this.list_users = false;
        this.create_users = true;
        this.edit_users = false;
        this.view_users = false;
        this.resetUser();
  }

  edit(user) {
        this.list_users = false;
        this.create_users = false;
        this.edit_users = true;
        this.view_users = false;
        this._id = user._id;
        this.userForm.controls['aadhaar_no'].setValue(user.aadhaar_no);
        this.userForm.controls['address'].setValue(user.address);
        this.userForm.controls['alternate_no'].setValue(user.alternate_no);
        this.userForm.controls['email'].setValue(user.email);
        this.userForm.controls['esi_no'].setValue(user.esi_no);
        this.userForm.controls['firstName'].setValue(user.firstName);
        this.userForm.controls['lastName'].setValue(user.lastName);
        this.userForm.controls['password'].setValue(user.password);
        this.userForm.controls['pan_no'].setValue(user.pan_no);
        this.userForm.controls['pf_no'].setValue(user.pf_no);
        this.userForm.controls['phone_no'].setValue(user.phone_no);
        this.userForm.controls['roles'].setValue(user.roles);
        this.userForm.controls['user_type'].setValue(user.user_type);
        this.userForm.controls['username'].setValue(user.username);
  }

  view(user) {
        this.list_users = false;
        this.create_users = false;
        this.edit_users = false;
        this.view_users = true;
        this.selected_user = user;
  }

  list() {
        this.list_users = true;
        this.create_users = false;
        this.edit_users = false;
        this.view_users = false;
        this.authService.searchUser().then((data) => {
          this.users = data;
          for(var i = 0; i < this.users.length; i++) {
            this.users[i].profileImageURL = "http://localhost:3000" + this.users[i].profileImageURL;
          }
        }, (err) => {
            console.log("not allowed");
        });
        this.resetUser();        
  }

  delete(user) {
      this.authService.deleteAccount(user).then((data) => {
        this.presentToast('User deleted successfully');
        this.list();
      }, (err) => {
          this.presentToast('Failed! Please try again.');
      });
  }
  
  save() {
    if(this.create_users) {
      this.authService.createAccount(this.userForm._value).then((data) => {
        this.presentToast('User data saved successfully');
        this.list();
      }, (err) => {
          this.presentToast('Failed! Please try again.');
      });
    }
    if(this.edit_users) {
      this.authService.updateAccount(this._id, this.userForm._value).then((data) => {
        this.presentToast('User data saved successfully');
        this.list();
      }, (err) => {
          this.presentToast('Failed! Please try again.');
      });
    }
  }
}