import { Component, ViewChild } from "@angular/core";
import { 
    NavController, 
    ModalController, 
    AlertController, 
    ActionSheetController, 
    ToastController, 
    Platform,
    App,
    MenuController,
    LoadingController
  } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash'
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

// Providers
import { Auth } from '../../providers/auth/auth';
import { Networks } from '../../providers/network/network';

// Pages
import { LoginPage } from '../login/login';

// Files Images
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

declare var cordova: any;

interface Window {
    resolveLocalFileSystemURL: any;
}
declare var window: Window;

@Component({
  selector: 'home-page',
  templateUrl: './home.html'
})
export class HomePage {
  public isAdmin: Boolean = false;
  public isUser: Boolean = false;
  public isMarketing: Boolean = false;
  public isExecutive: Boolean = false;

  public loader: any;

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController, 
    public alertCtrl: AlertController, 
    public authService: Auth, 
    public formBuilder: FormBuilder,
    private camera: Camera,
    private file: File,
    private filePath: FilePath,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public platform: Platform,
    public app: App,
    public menu: MenuController,
    public networkService: Networks,
    public storage: Storage,
    public loading: LoadingController
  ) {
      if (this.networkService.noConnection()) {
        this.networkService.showNetworkAlert();
      }
      this.storage.get('user').then((user) => {
          this.isAdmin = _.includes(user.roles, "admin");
          this.isUser = _.includes(user.roles, "user");
          this.isMarketing = _.includes(user.roles, "marketing");
          this.isExecutive = _.includes(user.roles, "executive");
      });
  }
 
  ionViewDidLoad() {
    this.loader = this.loading.create({
      content: 'Please wait...',
    });
  }

  logOut = () => {
    this.authService.logout();
    this.navCtrl.setRoot(LoginPage);
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

};