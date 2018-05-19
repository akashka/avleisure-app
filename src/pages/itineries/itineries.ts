import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';

import { Auth } from '../../providers/auth/auth';
import { Itineries } from '../../providers/itineries/itineries';
import { HomePage } from '../home/home';

import * as _ from 'lodash'
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Http, Headers } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-itineries',
  templateUrl: 'itineries.html',
})
export class ItineriesPage {

  public loader: any;
  public itineries: any;
  public list_itineries: Boolean = true;
  public create_itineries: Boolean = false;
  public edit_itineries: Boolean = false;
  public view_itineries: Boolean = false;
  public selected_itinery: any; 
  public itineryForm: any;
  public _id: String = '';
  public countries: any;
  public allStates = [{ id: 'Andaman and Nicobar Islands', label: 'Andaman and Nicobar Islands'}, { id: 'Andhra Pradesh', label: 'Andhra Pradesh'},
{ id: 'Arunachal Pradesh', label: 'Arunachal Pradesh'}, { id: 'Assam', label: 'Assam'}, { id: 'Bihar', label: 'Bihar'},
{ id: 'Chandigarh', label: 'Chandigarh'}, { id: 'Chhattisgarh', label: 'Chhattisgarh'}, { id: 'Dadra and Nagar Haveli', label: 'Dadra and Nagar Haveli'},
{ id: 'Daman and Diu union', label: 'Daman and Diu union'}, { id: 'Delhi', label: 'Delhi'}, { id: 'Goa', label: 'Goa'},
{ id: 'Gujarat', label: 'Gujarat'}, { id: 'Haryana', label: 'Haryana'}, { id: 'Himachal Pradesh', label: 'Himachal Pradesh'},
{ id: 'Jammu and Kashmir', label: 'Jammu and Kashmir'}, { id: 'Jharkhand', label: 'Jharkhand'}, { id: 'Karnataka', label: 'Karnataka'},
{ id: 'Kerala', label: 'Kerala'}, { id: 'Lakshadweep', label: 'Lakshadweep'}, { id: 'Madhya Pradesh', label: 'Madhya Pradesh'},
{ id: 'Maharashtra', label: 'Maharashtra'}, { id: 'Manipur', label: 'Manipur'}, { id: 'Meghalaya', label: 'Meghalaya'},
{ id: 'Mizoram', label: 'Mizoram'}, { id: 'Nagaland', label: 'Nagaland'}, { id: 'Odisha', label: 'Odisha'},
{ id: 'Puducherry', label: 'Puducherry'}, { id: 'Punjab', label: 'Punjab'}, { id: 'Rajasthan', label: 'Rajasthan'},
{ id: 'Sikkim', label: 'Sikkim'}, { id: 'Tamil Nadu', label: 'Tamil Nadu'}, { id: 'Telangana', label: 'Telangana'},
{ id: 'Tripura', label: 'Tripura'}, { id: 'Uttar Pradesh', label: 'Uttar Pradesh'},
{ id: 'Uttarakhand', label: 'Uttarakhand'}, { id: 'West Bengal', label: 'West Bengal'}];

  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      public modalCtrl: ModalController, 
      public alertCtrl: AlertController, 
      public authService: Auth, 
      public itineryService: Itineries, 
      public loading: LoadingController,
      public storage: Storage,
      public toastCtrl: ToastController,
      public CallNumber: CallNumber,
      public formBuilder: FormBuilder,
      public http: Http
  ) {
      this.itineryForm = formBuilder.group({
          title: ['', Validators.compose([Validators.required])],
          plan: [''],
          nights: ['', Validators.compose([Validators.required])],
          days: ['', Validators.compose([Validators.required])],
          international: ['', Validators.compose([Validators.required])],
          sstate: [''],
          package_type: ['', Validators.compose([Validators.required])],
          description: [''],
      });
  }

  ionViewDidLoad() {
    this.loader = this.loading.create({
      content: 'Please wait...',
    });
    this.itineryService.searchItineries().then((data) => {
      this.itineries = data;
    }, (err) => {
        console.log("not allowed");
    });

    let headers = new Headers();
    headers.append('X-Mashape-Key', "4wOIcPPcz5mshzxfbe0rJDkWEJPip1Mz7FFjsnuwnKvsUAdcVg");
    var url = 'https://restcountries-v1.p.mashape.com/all';
    this.http.get(url, {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          this.countries = data;
        }, (err) => { }); 
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  create() {
        this.list_itineries = false;
        this.create_itineries = true;
        this.edit_itineries = false;
        this.view_itineries = false;
  }

  edit(itinery) {
        this.list_itineries = false;
        this.create_itineries = false;
        this.edit_itineries = true;
        this.view_itineries = false;
        this._id = itinery._id;
        this.itineryForm.controls['title'].setValue(itinery.title);
        this.itineryForm.controls['plan'].setValue(itinery.plan);
        this.itineryForm.controls['nights'].setValue(itinery.nights);
        this.itineryForm.controls['days'].setValue(itinery.days);
        this.itineryForm.controls['international'].setValue(itinery.international);
        this.itineryForm.controls['sstate'].setValue(itinery.sstate);
        this.itineryForm.controls['package_type'].setValue(itinery.package_type);
        this.itineryForm.controls['description'].setValue(itinery.description);
  } 

  view(user) {
        this.list_itineries = false;
        this.create_itineries = false;
        this.edit_itineries = false;
        this.view_itineries = true;
        this.selected_itinery = user;
  }

  list() {
        this.list_itineries = true;
        this.create_itineries = false;
        this.edit_itineries = false;
        this.view_itineries = false;
        this.itineryService.searchItineries().then((data) => {
          this.itineries = data;
        }, (err) => {
            console.log("not allowed");
        });
  }

  reset() {
        this.itineryForm.controls['title'].setValue('');
        this.itineryForm.controls['plan'].setValue('');
        this.itineryForm.controls['nights'].setValue('');
        this.itineryForm.controls['days'].setValue('');
        this.itineryForm.controls['international'].setValue('');
        this.itineryForm.controls['sstate'].setValue('');
        this.itineryForm.controls['package_type'].setValue('');
        this.itineryForm.controls['description'].setValue('');
  }

  save() {
    if(this.create_itineries) {
      this.itineryService.createItinery(this.itineryForm._value).then((data) => {
        this.presentToast('Itinery data saved successfully');
        this.list();
      }, (err) => {
          this.presentToast('Failed! Please try again.');
      });
    }
    if(this.edit_itineries) {
      this.itineryService.updateItinery(this._id, this.itineryForm._value).then((data) => {
        this.presentToast('Itinery data saved successfully');
        this.list();
      }, (err) => {
          this.presentToast('Failed! Please try again.');
      });
    }
  }

}
