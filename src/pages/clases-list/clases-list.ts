import { GlobalVariablesProvider } from './../../providers/global-variables/global-variables';
import { Clase } from './../../models/Clase';
import { Usuario } from './../../models/Usuario';
import { ClasesDetailPage } from './../clases-detail/clases-detail';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ClasesServiceProvider } from '../../providers/clases-service/clases-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';


@Component({
  selector: 'page-clases-list',
  templateUrl: 'clases-list.html',
})
export class ClasesListPage {

  clases: Clase[];
  user: Usuario;

  constructor(public navCtrl: NavController, public navParams: NavParams, public global: GlobalVariablesProvider, public clasesService : ClasesServiceProvider, public userService : UserServiceProvider) {

    this.user = global.CurrentUser;
    this.clases = global.Clases;
    
  }

  ionViewDidLoad() {
    
    console.log('ionViewDidLoad ClasesListPage');
  }

  Detail(Class){
    this.navCtrl.push(ClasesDetailPage,{ item:Class, calificar: false});
  }

}
