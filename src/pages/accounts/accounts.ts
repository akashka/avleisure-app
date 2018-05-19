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
  selector: 'page-accounts',
  templateUrl: 'accounts.html',
})
export class AccountsPage {

  public loader: any;
  public itineries: any;
  public enquiries: any;
  public bookings: any;
  public users: any;
  public trips: any;

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

    calculatePaidAmount = function(amt) {
			var total = 0;
			for(var a=0; a<amt.length; a++) {
				total += Number(amt.amount_paid);
			}
			return total;
		}

		calculatePendingAmount = function(amt, booked) {
			var total = 0;
			for(var a=0; a<amt.length; a++) {
				total += Number(amt.amount_paid);
			}
			return (Number(booked) - total);
		}

		calculateExpenses = function(booking) {
			var total = 0;
			for(var i=0; i<booking.expenses.length; i++) {
				total += Number(booking.expenses[i].total_amount);
			}	
			return total;
		}

		onTripExpenses = function(booking) {
			var total = 0;
			for(var i=0; i<this.trips.length; i++) {
				if(this.trips[i].booking_id == booking.booking_id) {
					for(var j=0; j<this.trips[i].transactions.length; j++) {
						if(!this.trips[i].transactions[j].credit) total += Number(this.trips[i].transactions[j].amount);
					}
				}
			}
			return total;
		}
		
		calculateBalance = function(booking) {
			var onTripExpense = 0;
			for(var i=0; i<this.trips.length; i++) {
				if(this.trips[i].booking_id == booking.booking_id) {
					for(var j=0; j<this.trips[i].transactions.length; j++) {
						if(!this.trips[i].transactions[j].credit) onTripExpense += Number(this.trips[i].transactions[j].amount);
					}
				}
			}
			var expenses = 0;
			for(var i=0; i<booking.expenses.length; i++) {
				expenses += Number(booking.expenses[i].total_amount);
			}	
			return (Number(booking.booking_amount) - (onTripExpense + expenses));
		}

		findName = function(tm) {
			for(var i=0; i<this.users.length; i++) {
				if(this.users[i]._id == tm) return this.users[i].displayName;
			}
			return "";
		}

}
