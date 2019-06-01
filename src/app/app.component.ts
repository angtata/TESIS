import { DashboardEstudiantePage } from './../pages/dashboard-estudiante/dashboard-estudiante';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from './../pages/login/login';
import { FCM } from '@ionic-native/fcm';
import { NotificationsProvider } from '../providers/notifications/notifications';
import { GoogleMaps } from '@ionic-native/google-maps';
import { ImagePicker } from '@ionic-native/image-picker';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  tipoIngreso: boolean = false;

  constructor(public notificaciones: NotificationsProvider, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
    this.rootPage = LoginPage;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.notificaciones.recibeNotificaciones();
    });
  }

  
}
