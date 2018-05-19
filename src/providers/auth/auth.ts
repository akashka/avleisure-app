import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
 
@Injectable()
export class Auth {
 
  public token: any;
  // url = "https://avleisure.herokuapp.com/";
  url = "http://localhost:3000/";

  public static userChanged: EventEmitter<boolean> = new EventEmitter();

  constructor(public http: Http, public storage: Storage) {
 
  }
 
  checkAuthentication(){
    return new Promise((resolve, reject) => {
        //Load token if exists
        this.storage.get('token').then((value) => {
            this.token = value;
            let headers = new Headers();
            headers.append('Authorization', this.token);
            this.storage.get('user').then((user) => {
              Auth.userChanged.next(user);
              resolve(user);
            });          
            // this.http.get(this.url + 'api/auth/protected', {headers: headers})
                // .subscribe(res => {
                    // resolve(res);
                // }, (err) => {
                    // reject(err);
                // }); 
        });         
    });
  }
 
  createAccount(details){
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post(this.url+'api/auth/signup', JSON.stringify(details), {headers: headers})
          .subscribe(res => {
            let data = res.json();
            this.token = data.token;
            resolve(data);
          }, (err) => {
            reject(err);
          });
    });
  }

  updateAccount(_id, details){
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post(this.url+'api/users/'+_id, JSON.stringify(details), {headers: headers})
          .subscribe(res => {
            let data = res.json();
            this.token = data.token;
            resolve(data);
          }, (err) => {
            reject(err);
          });
    });
  }
 
  login(credentials){
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        credentials.usernameOrEmail = credentials.email ;
        this.http.post(this.url+'api/auth/signin', JSON.stringify(credentials), {headers: headers})
          .subscribe(res => {
            let data = res.json();
            this.token = 'set';
            if(data){
              this.storage.set('token', 'set');
              this.storage.set('user', data).then((res) => {
                Auth.userChanged.next(data);
              });
            }
            resolve(data);
            resolve(res.json());
          }, (err) => {
            reject(err);
          });
    });
  }

  forgotPassword(credentials){
      return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post(this.url+'api/auth/forgotPassword', JSON.stringify(credentials), {headers: headers})
          .subscribe(res => {
            let data = res.json();
            resolve(data);
          }, (err) => {
            reject(err);
          });
      });
  }

  searchUser(){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.get(this.url+'api/users', {headers: headers})
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });
  }
 
  logout(){
    this.storage.set('token', '');
    this.storage.set('user', {});
    Auth.userChanged.next(true);
  }

  deleteAccount(details){
    return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.http.delete(this.url+'api/users/'+details._id, {headers: headers})
          .subscribe(res => {
            let data = res.json();
            this.token = data.token;
            resolve(data);
          }, (err) => {
            reject(err);
          });
    });
  }
 
}