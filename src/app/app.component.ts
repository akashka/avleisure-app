import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Storage } from '@ionic/storage';
import * as _ from 'lodash'

// Pages
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { UsersPage } from '../pages/users/users';
import { ItineriesPage } from '../pages/itineries/itineries';
import { EnquiriesPage } from '../pages/enquiries/enquiries';
import { QuotationsPage } from '../pages/quotations/quotations';
import { BookingsPage } from '../pages/bookings/bookings';
import { TripsPage } from '../pages/trips/trips';
import { AccountsPage } from '../pages/accounts/accounts';
import { ReportsPage } from '../pages/reports/reports';

// Services
import { Auth } from '../providers/auth/auth';
import { Networks } from '../providers/network/network';
import { Itineries } from '../providers/itineries/itineries';
import { Bookings } from '../providers/bookings/bookings';
import { Enquiries } from '../providers/enquiries/enquiries';
import { Trips } from '../providers/trips/trips';

@Component({
  templateUrl: './app.html'
})

export class MyApp {
  rootPage = LoginPage;

  public isAdmin: Boolean = false;
  public isUser: Boolean = false;
  public isMarketing: Boolean = false;
  public isExecutive: Boolean = false;
  public showMenu: Boolean = false;
  public user;

  userSubscription;

  @ViewChild(Nav) nav: Nav;
 
  constructor(platform: Platform, public storage: Storage, public authService: Auth) {
    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });

    this.userSubscription = Auth.userChanged.subscribe(
      (user) => this.getData(user)
    );
  }

  getData(user) {
        this.user = user;
        this.user.img = "https://localhost:3000/" + this.user.profileImageURL;
        if(user && user.roles) {
          this.isAdmin = _.includes(user.roles, "admin");
          this.isUser = _.includes(user.roles, "user");
          this.isMarketing = _.includes(user.roles, "marketing");
          this.isExecutive = _.includes(user.roles, "executive");
        }
  }

  go_to_home(){
    this.nav.setRoot(HomePage);  
  }

  go_to_login(){
    // this.authService.logout();
    this.nav.setRoot(LoginPage);  
  }

  go_to_users()  {
    this.nav.push(UsersPage);    
  }

  go_to_itineries()  {
    this.nav.push(ItineriesPage);    
  }

  go_to_enquiries()  {
    this.nav.push(EnquiriesPage);    
  }

  go_to_quotations()  {
    this.nav.push(QuotationsPage);    
  }

  go_to_bookings()  {
    this.nav.push(BookingsPage);    
  }

  go_to_trips()  {
    this.nav.push(TripsPage);    
  }

  go_to_accounts()  {
    this.nav.push(AccountsPage);    
  }

  go_to_reports()  {
    this.nav.push(ReportsPage);    
  }

  go_to_change_password() {

  }

  go_to_edit_profile() {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
  }

}