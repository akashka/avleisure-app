import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Auth } from '../auth/auth';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Injectable()
export class Bookings {

// url = "https://avleisure.herokuapp.com/";
  url = "http://localhost:3000/";
 
  constructor(public http: Http, public authService: Auth, public storage: Storage) {
 
  }
 
  // Function to get list of al the bookings
  searchBookings(){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Authorization', this.authService.token);
      this.http.get(this.url+'api/bookings', {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }
 
  createBooking(booking){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', this.authService.token);
      this.http.post(this.url+'api/bookings', JSON.stringify(booking), {headers: headers})
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }
 
  updateBooking(_id, booking){
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Authorization', this.authService.token);
        this.http.put(this.url+'api/bookings/' + _id, booking, {headers: headers})
          .map(res => res.json())
          .subscribe((res) => {
            resolve(res);
          }, (err) => {
            reject(err);
          });    
    });
  }
 
}