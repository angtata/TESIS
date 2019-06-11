import { SolicitudClasePage } from './../../pages/solicitud-clase/solicitud-clase';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Configuracion } from '../../app/app.configuration';
import { FCM } from '@ionic-native/fcm';
import { ModalController, AlertController } from 'ionic-angular';
import { GlobalVariablesProvider } from '../global-variables/global-variables';

@Injectable()

export class NotificationsProvider {

  FCM_Token : any;

  constructor(public http: Http, private fcm: FCM, public modalCtrl: ModalController, public global : GlobalVariablesProvider, private alertCtrl: AlertController) {
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
}
