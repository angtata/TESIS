import { Component, Injector } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalVariablesProvider } from '../../providers/global-variables/global-variables';
import { NotificationsProvider } from '../../providers/notifications/notifications';

@Component({
  selector: 'page-solicitud-clase',
  templateUrl: 'solicitud-clase.html'
})

export class SolicitudClasePage {

  opcionesClase: any;

  constructor(public injector: Injector, public navCtrl: NavController, public navParams: NavParams, public global : GlobalVariablesProvider) {
    this.opcionesClase = this.global.TempClase.opciones.filter( element => {
      return element.isSelected == true;
    })
    this.opcionesClase.shift();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SolicitudClasePage');
  }

  Rechazar(){
    this.navCtrl.pop();
    var notificaciones = this.injector.get(NotificationsProvider)
    notificaciones.getTokenUser(this.global.TempClase.user.UsuarioId).then( data  =>{
      let token = data[0].FCM_Token
      notificaciones.sendNotification(token,{ user : this.global.CurrentUser, rechazar : true},{ titulo : "" , cuerpo : ""})
      .then(() => console.log("ok"))
      .catch(err => console.error(JSON.stringify(err)))
    })
  }

  Aceptar(){
    this.navCtrl.pop();
    var notificaciones = this.injector.get(NotificationsProvider)
    notificaciones.getTokenUser(this.global.TempClase.user.UsuarioId).then( data  =>{
      let token = data[0].FCM_Token
      notificaciones.sendNotification(token,{ user : this.global.CurrentUser, rechazar : false},{ titulo : "" , cuerpo : ""})
      .then(() => console.log("ok"))
      .catch(err => console.error(JSON.stringify(err)))
    })
  }

}
