import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { BrowserModule } from '@angular/platform-browser'
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from "ion2-calendar";
import { CallNumber } from '@ionic-native/call-number';

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

// Providers
import { Networks } from '../providers/network/network';
import { Auth } from '../providers/auth/auth';
import { Itineries } from '../providers/itineries/itineries';
import { Bookings } from '../providers/bookings/bookings';
import { Enquiries } from '../providers/enquiries/enquiries';
import { Trips } from '../providers/trips/trips';

// Camera
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    UsersPage,
    ItineriesPage,
    EnquiriesPage,
    QuotationsPage,
    BookingsPage,
    TripsPage,
    AccountsPage,
    ReportsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    CalendarModule,
    IonicStorageModule.forRoot(MyApp),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    UsersPage,
    ItineriesPage,
    EnquiriesPage,
    QuotationsPage,
    BookingsPage,
    TripsPage,
    AccountsPage,
    ReportsPage
  ],
  providers: [
    IonicStorageModule,
    Auth,
    Networks,
    Itineries,
    Bookings,
    Enquiries,
    Trips,
    File,
    Transfer,
    Camera,
    FilePath,
    CallNumber
  ]
})
export class AppModule {}