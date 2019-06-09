import { SolicitudClasePage } from './../../pages/solicitud-clase/solicitud-clase';
import { Http } from '@angular/http';
import { Injectable, Injector } from '@angular/core';
import { Configuracion } from '../../app/app.configuration';
import { FCM } from '@ionic-native/fcm';
import { ModalController, AlertController } from 'ionic-angular';
import { GlobalVariablesProvider } from '../global-variables/global-variables';
import { SolicitarClaseProvider } from '../solicitar-clase/solicitar-clase';
import { CandidatoClasePage } from '../../pages/candidato-clase/candidato-clase';

@Injectable()

export class NotificationsProvider {

  FCM_Token : any;

  constructor(public injector: Injector, public http: Http, private fcm: FCM, public modalCtrl: ModalController, public global : GlobalVariablesProvider, private alertCtrl: AlertController) {
    console.log('Hello NotificationsProvider Provider');
  }

  getToken(user){
    this.fcm.getToken().then(token => {
      this.FCM_Token = token;
      this.updateToken({ Token: this.FCM_Token, UsuarioId : user })
        .then(() => console.log("Token registrado"))
        .catch(err => console.error(JSON.stringify(err)))
      });
  }

  updateToken(params) {
    return new Promise((resolve, reject) => {
      this.http.post(`${Configuracion.URL}usuarios/token`, params).subscribe(data => {
        resolve(data.json());
      }, err => { reject(err) })
    });
  }

  sendNotification(token : string, opciones, mensaje ){
    return new Promise((resolve, reject) => {
      let params = { Token: token, Opciones: opciones, Titulo : mensaje.titulo, Cuerpo : mensaje.cuerpo }
      this.http.post(`${Configuracion.URL}notificaciones`, params).subscribe(data => {
        resolve(data.json());
      }, err => { reject(err) })
    });
  }

  getTokenUser(UsuarioId : String) {
    return new Promise((resolve, reject) => {
      this.http.get(`${Configuracion.URL}usuarios/token/${UsuarioId}`).subscribe(data => {
        resolve(data.json());
      }, err => { reject(err) })
    });
  }

  recibeNotificaciones() {
    this.fcm.onNotification().subscribe(data => {
      let value = JSON.parse(data.value)
      if(!this.global.TipoIngeso){
        this.recibeNotificacionProfe(value);
      }else{
        this.recibeNotificacionEstud(value);
      }
    });
  }

  recibeNotificacionProfe(value){
    if(value.rechazar == undefined){
      this.global.TempClase = value;
      var d1 = new Date(this.global.TempClase.hora)
      var d2 = new Date()
      var diference = d2.getTime() - d1.getTime() 
      if ( diference < 30000 ){
        this.global.downloadFile(this.global.TempClase.user.Correo).then( file => {
          this.global.TempClase.user.Imagen = String(file) + '?' + this.random();
          let profileModal = this.modalCtrl.create(SolicitudClasePage, {}, { cssClass: 'select-modal2' });
          profileModal.present();
        })
      }
    }else{
      this.global.ClaseRechazada = value;
      if(this.global.ClaseRechazada.rechazar){
        this.errorAlert();
      }else{
        console.log("match realizado!")
      }
    }
  }

  recibeNotificacionEstud(value){
    this.global.ClaseRechazada = value;
    if(this.global.ClaseRechazada.rechazar){
      var solicitarClase = this.injector.get(SolicitarClaseProvider)
      solicitarClase.ProfesoresDisponible.pop();
      solicitarClase.Profesores();
    }else{
      this.global.downloadFile(this.global.ClaseRechazada.user.Correo).then( file => {
        this.global.TempClase.user.Imagen = String(file) + '?' + this.random();
        let profileModal = this.modalCtrl.create(CandidatoClasePage, {}, { cssClass: 'select-modal3' });
        profileModal.present();
      })
    }
  }

  random(): number {
    let rand = Math.floor(Math.random()*20000000)+1000000;
    return rand;       
  }

  errorAlert() {
    let alert = this.alertCtrl.create({
      title: 'Ups!',
      subTitle: 'El estudiante ha declinado tu oferta',
      buttons: ['Aceptar']
    });
    alert.present();
  }

}
