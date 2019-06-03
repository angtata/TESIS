import { SolicitarClaseProvider } from './../../providers/solicitar-clase/solicitar-clase';
import { Component, Injector } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { GlobalVariablesProvider } from '../../providers/global-variables/global-variables';
import { MenuPage } from '../menu/menu';
import { NotificationsProvider } from '../../providers/notifications/notifications';

@Component({
  selector: 'page-candidato-clase',
  templateUrl: 'candidato-clase.html',
})
export class CandidatoClasePage {

  constructor(private appCtrl: App, public injector: Injector, public navCtrl: NavController, public navParams: NavParams,  public global : GlobalVariablesProvider) {
  }

  ionViewDidLoad() { 
    console.log('ionViewDidLoad CandidatoClasePage');
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

  Seguir(){
    this.navCtrl.pop();
    var solicitar = this.injector.get(SolicitarClaseProvider)
    solicitar.ProfesoresDisponible.pop();
    solicitar.Profesores();
  }

  Aceptar(){
    console.log("Aceptar")
  }

}
