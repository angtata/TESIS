import { MenuPage } from './../menu/menu';
import { GlobalVariablesProvider } from './../../providers/global-variables/global-variables';
import { Component } from '@angular/core';
import { NavController, App, Platform } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private appCtrl: App, public globalV : GlobalVariablesProvider, public platform: Platform,) {
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        appCtrl.navPop();
      });
  })
  }

  nextpageStudent(){
    this.globalV.TipoIngeso = true;
    this.navCtrl.pop();
    this.appCtrl.getRootNavs()[0].setRoot(MenuPage);
  }

  nextpageTeacher(){
    this.globalV.TipoIngeso = false;
    this.navCtrl.pop();
    this.appCtrl.getRootNavs()[0].setRoot(MenuPage);
  }

}
