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
  selector: 'page-bookings',
  templateUrl: 'bookings.html',
})
export class BookingsPage {

  public loader: any;
  public itineries: any;
  public enquiries: any;
  public bookings: any;
  public users: any;
  public trips: any;
  public list_bookings: Boolean = true;
  public create_bookings: Boolean = false;
  public edit_bookings: Boolean = false;
  public view_bookings: Boolean = false;
  public selected_booking: any; 
  public bookingForm;
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
      this.bookingForm = formBuilder.group({
          // package_type: ['', Validators.compose([Validators.required])],
      });
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

  create() {
        this.list_bookings = false;
        this.create_bookings = true;
        this.edit_bookings = false;
        this.view_bookings = false;
  }

  edit(enquiry) {
        this.list_bookings = false;
        this.create_bookings = false;
        this.edit_bookings = true;
        this.view_bookings = false;
        this._id = enquiry._id;
        // this.bookingForm.controls['title'].setValue(itinery.title);
  } 

  view(enquiry) {
        this.list_bookings = false;
        this.create_bookings = false;
        this.edit_bookings = false;
        this.view_bookings = true;
        this.selected_booking = enquiry;
  }

  list() {
        this.list_bookings = true;
        this.create_bookings = false;
        this.edit_bookings = false;
        this.view_bookings = false;
        this.enquiriesService.searchEnquiries().then((data) => {
          this.enquiries = data;
        }, (err) => {
            console.log("not allowed");
        });
  }

  reset() {
        // this.bookingForm.controls['title'].setValue('');
  }

  save() {
    if(this.create_bookings) {
      this.bookingsService.createBooking(this.bookingForm._value).then((data) => {
        this.presentToast('Booking data saved successfully');
        this.list();
      }, (err) => {
          this.presentToast('Failed! Please try again.');
      });
    }
    if(this.edit_bookings) {
      this.bookingsService.updateBooking(this._id, this.bookingForm._value).then((data) => {
        this.presentToast('Booking data saved successfully');
        this.list();
      }, (err) => {
          this.presentToast('Failed! Please try again.');
      });
    }
  }

  calculateDiff = function(sdate) {
    var date2 = new Date();
    var date1 = new Date(sdate);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  calculateSmartRemark = function(booking) {
    var trip = _.find(this.trips, function(o) {
        return o.booking_id == booking.booking_id
    });
    var isTripOn = false;
    var isTripCompleted = false;
    if(trip != undefined) {
      if(trip.trip_end_date != undefined && trip.trip_end_date != null && trip.trip_end_date != ""
      && trip.trip_end_by != undefined && trip.trip_end_by != null && trip.trip_end_by != "")
        var isTripCompleted = true;
      var isTripOn = true;
    }
    var dayDiff = this.calculateDiff(booking.booking_date);
    if(isTripCompleted) return("Trip is completed"); 
    if(isTripOn) return("Trip is ongoing");
    return ("Trip starts in " + dayDiff + " days");
  }

}
