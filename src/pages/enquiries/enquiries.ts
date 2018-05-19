import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';

import { Auth } from '../../providers/auth/auth';
import { Itineries } from '../../providers/itineries/itineries';
import { Bookings } from '../../providers/bookings/bookings';
import { Trips } from '../../providers/trips/trips';
import { Enquiries } from '../../providers/enquiries/enquiries';
import { HomePage } from '../home/home';

import * as _ from 'lodash'
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Http, Headers } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-enquiries',
  templateUrl: 'enquiries.html',
})
export class EnquiriesPage {

  public loader: any;
  public itineries: any;
  public enquiries: any;
  public bookings: any;
  public users: any;
  public trips: any;
  public list_enquiries: Boolean = true;
  public create_enquiries: Boolean = false;
  public edit_enquiries: Boolean = false;
  public view_enquiries: Boolean = false;
  public selected_enquiry: any; 
  public enquiryForm: any;
  public _id: String = '';

  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      public modalCtrl: ModalController, 
      public alertCtrl: AlertController, 
      public authService: Auth, 
      public itineryService: Itineries, 
      public bookingsService: Bookings, 
      public tripsService: Trips, 
      public enquiriesService: Enquiries, 
      public loading: LoadingController,
      public storage: Storage,
      public toastCtrl: ToastController,
      public CallNumber: CallNumber,
      public formBuilder: FormBuilder,
      public http: Http
  ) {
      this.enquiryForm = formBuilder.group({
          enquiry_id: ['', Validators.compose([Validators.required])],
          school_name: ['', Validators.compose([Validators.required])],
          school_address: ['', Validators.compose([Validators.required])],
          school_gprs: [''],
          school_photo: [''],
          school_email_id: ['', Validators.compose([Validators.maxLength(30), Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"), Validators.required])],
          school_phone_no: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*'), Validators.required])],
          school_contact_person: [''],
          enquiries: [[]],
          enquiry_by: [[]]
      });
  }

  public enquiry = {
    itineries: '',
    plan: '',
    transport: [],
    food: [],
    accomodation: [],
    sharing: [],
    package_type: [],
    school_class: [],
    remarks: ''
  }

  ionViewDidLoad() {
      this.loader = this.loading.create({
        content: 'Please wait...',
      });

      // Itineries
      this.itineryService.searchItineries().then((data) => {
        this.itineries = data;
      }, (err) => {
          console.log("not allowed");
      });

      // Bookings
      this.bookingsService.searchBookings().then((data) => {
        this.bookings = data;
      }, (err) => {
          console.log("not allowed");
      });

      this.enquiriesService.searchEnquiries().then((data) => {
        this.enquiries = data;
      }, (err) => {
          console.log("not allowed");
      });

      this.tripsService.searchTrips().then((data) => {
        this.trips = data;
      }, (err) => {
          console.log("not allowed");
      });

      this.authService.searchUser().then((data) => {
        this.users = data;
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

  findBackgroundClass = function(enquiry) {
    var isQuotationGiven = false;
    var isBookingDone = false;
    for(var e=0; e<enquiry.enquiries.length; e++) {
      if(enquiry.enquiries[e].quotations.length <= 0) isQuotationGiven = true;
    }
    var enq = _.find(this.bookings, function(o) {
        return o.enquiry_id == enquiry.enquiry_id
    });
    if(enq != undefined) isBookingDone = true;
    if(isBookingDone) return "booked";
    else if(isQuotationGiven) return "followup";
    else return "quotation";
  }

  countSimilarSchool = function(school_name) {
    var found = _.filter(this.enquiries, function(o){
        return o.school_name == school_name
    });
    if(found.length-1 <= 0) return '';
    return found.length-1;
  }

  create() {
        this.list_enquiries = false;
        this.create_enquiries = true;
        this.edit_enquiries = false;
        this.view_enquiries = false;
  }

  edit(enquiry) {
        this.list_enquiries = false;
        this.create_enquiries = false;
        this.edit_enquiries = true;
        this.view_enquiries = false;
        this._id = enquiry._id;
        // this.enquiryForm.controls['title'].setValue(itinery.title);
  } 

  view(enquiry) {
        this.list_enquiries = false;
        this.create_enquiries = false;
        this.edit_enquiries = false;
        this.view_enquiries = true;
        this.selected_enquiry = enquiry;
  }

  list() {
        this.list_enquiries = true;
        this.create_enquiries = false;
        this.edit_enquiries = false;
        this.view_enquiries = false;
        this.enquiriesService.searchEnquiries().then((data) => {
          this.enquiries = data;
        }, (err) => {
            console.log("not allowed");
        });
  }

  reset() {
        // this.enquiryForm.controls['title'].setValue('');
  }

  save() {
    if(this.create_enquiries) {
      this.enquiriesService.createEnquiry(this.enquiryForm._value).then((data) => {
        this.presentToast('Enquiry data saved successfully');
        this.list();
      }, (err) => {
          this.presentToast('Failed! Please try again.');
      });
    }
    if(this.edit_enquiries) {
      this.enquiriesService.updateEnquiry(this._id, this.enquiryForm._value).then((data) => {
        this.presentToast('Enquiry data saved successfully');
        this.list();
      }, (err) => {
          this.presentToast('Failed! Please try again.');
      });
    }
  }

}
