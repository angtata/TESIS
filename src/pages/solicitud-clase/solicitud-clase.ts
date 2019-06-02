import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalVariablesProvider } from '../../providers/global-variables/global-variables';


@Component({
  selector: 'page-solicitud-clase',
  templateUrl: 'solicitud-clase.html',
})

export class SolicitudClasePage {

  opcionesClase: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public global : GlobalVariablesProvider) {
    this.opcionesClase = this.global.TempClase.opciones.filter( element => {
      return element.isSelected == true;
    })
    this.opcionesClase.shift();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SolicitudClasePage');
  }
  Rechazar(){
    console.log("rechazar")
  }

  Aceptar(){
    console.log("Aceptar")
  }

}
