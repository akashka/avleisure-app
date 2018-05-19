import { Injectable } from '@angular/core';
import {AlertController} from 'ionic-angular';
import {Network} from 'ionic-native';

declare var cordova:any;

@Injectable()
export class Networks {

  constructor(public alertCtrl: AlertController) {
  }

  noConnection() {
    return (Network.type === 'none');
  }

  private showSettings() {
    if (cordova.plugins.diagnostic.switchToWifiSettings) {
      cordova.plugins.diagnostic.switchToWifiSettings();
    } else {
      cordova.plugins.diagnostic.switchToSettings();
    }
  }

  showNetworkAlert() {
    let networkAlert = this.alertCtrl.create({
      title: 'No Internet Connection',
      message: 'Please check your internet connection.',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {}
        },
        {
          text: 'Open Settings',
          handler: () => {
            networkAlert.dismiss().then(() => {
              this.showSettings();
            })
          }
        }
      ]
    });
    networkAlert.present();
  }

}