import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Auth } from '../auth/auth';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Injectable()
export class Enquiries {

// url = "https://avleisure.herokuapp.com/";
  url = "http://localhost:3000/";
 
  constructor(public http: Http, public authService: Auth, public storage: Storage) {
 
  }
 
  // Function to get list of al the enquiries
  searchEnquiries(){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Authorization', this.authService.token);
      this.http.get(this.url+'api/enquiries', {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }
 
  createEnquiry(enquiry){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', this.authService.token);
      this.http.post(this.url+'api/enquiries', JSON.stringify(enquiry), {headers: headers})
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }
 
  updateEnquiry(_id, enquiry){
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Authorization', this.authService.token);
        this.http.put(this.url+'api/enquiries/' + _id, enquiry, {headers: headers})
          .map(res => res.json())
          .subscribe((res) => {
            resolve(res);
          }, (err) => {
            reject(err);
          });    
    });
  }
 
}