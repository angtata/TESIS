import { GlobalVariablesProvider } from './../providers/global-variables/global-variables';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from './../pages/login/login';
import { NotificationsProvider } from '../providers/notifications/notifications';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { MenuPage } from '../pages/menu/menu';
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  tipoIngreso: boolean = false;

  constructor(public notificaciones: NotificationsProvider, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private secureStorage: SecureStorage, private global : GlobalVariablesProvider, public modalCtrl: ModalController) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.notificaciones.recibeNotificaciones();
      this.secureStorage.create('login').then((storage: SecureStorageObject) =>{
        storage.get('user')
          .then( data => {
            console.log("storage!!"); 
            this.global.CurrentUser = JSON.parse(data); 
            if(this.global.CurrentUser.TipoUsuario == 4 || this.global.CurrentUser.TipoUsuario == 5){
              this.rootPage = LoginPage;
              let profileModal = this.modalCtrl.create(HomePage, {}, {cssClass: 'select-modal' });
              profileModal.present();
            }else{
              this.global.TipoIngeso = this.global.CurrentUser.TipoUsuario == 1 ? true : false;
              this.rootPage = MenuPage; 
            }
            
          })
          .catch(err => { console.error(JSON.stringify(err)); this.rootPage = LoginPage; })
      })
    });
  }

  
}
