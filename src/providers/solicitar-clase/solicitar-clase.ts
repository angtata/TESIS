import { CandidatoClasePage } from './../../pages/candidato-clase/candidato-clase';
import { Usuario } from './../../models/Usuario';
import { UserServiceProvider } from './../user-service/user-service';
import { Injectable } from '@angular/core';
import { NotificationsProvider } from '../notifications/notifications';
import { GlobalVariablesProvider } from '../global-variables/global-variables';
import { ModalController, AlertController } from 'ionic-angular';

declare var google;

@Injectable()

export class SolicitarClaseProvider {

  opcionesClase : any;
  listProfes : Usuario[];
  ProfesoresDisponible : any[] = [];

  constructor(public users: UserServiceProvider, public notificaciones: NotificationsProvider, public global : GlobalVariablesProvider, public modalCtrl: ModalController, private alertCtrl: AlertController) {
    console.log('Hello SolicitarClaseProvider Provider');
  }

  SolicitarClaseP(opciones){
      this.opcionesClase = opciones;
      this.users.getAllTeachers().then( data => {
        this.listProfes = <Usuario[]>data;
        var Profes = this.listProfes.filter( element => {
          return element.EstadoNombre == 'Activo'
        })
        if (opciones.opciones[0].isSelected == true ){
          Profes = Profes.filter( element => {
            return element.TipoUsuario == 3 || element.TipoUsuario == 5;
          })
        }else{
          Profes = Profes.filter( element => {
            return element.TipoUsuario == 2 || element.TipoUsuario == 4;
          })
        }
        var distancias = [];
        Profes.forEach( element => {
          let profeUbc = new google.maps.LatLng(element.Latitud, element.Latitud)
          let studentUbc =  new google.maps.LatLng(opciones.ubicacion.lat, opciones.ubicacion.lng)
          let distance = google.maps.geometry.spherical.computeDistanceBetween(studentUbc, profeUbc);
          distancias.push({user: element.UsuarioId, distancia : distance})
        })
        distancias = distancias.sort(function(a,b) { return a.distancia - b.distancia;})
        this.ProfesoresDisponible = distancias;
        this.Profesores()
    })
  }

  Profesores(){
    if(this.ProfesoresDisponible.length > 0){
      this.ValidarProfe(this.ProfesoresDisponible[0].user, this.opcionesClase)
    }else{
      this.errorAlert();
    }
  }

  ValidarProfe(user, opciones){
      this.notificaciones.getTokenUser(user).then( data => {
        let token = data[0].FCM_Token
        this.notificaciones.sendNotification(token,opciones,{ titulo : "¡Hay una Clase Disponible!" , cuerpo : `¡Acepta dictarle una clase a ${opciones.user.NombreCompleto}!`})
        .then( () => { 
          setTimeout( () => { 
            if(this.global.ClaseRechazada.rechazar || this.global.ClaseRechazada.rechazar == null){
              this.ProfesoresDisponible.pop();
              this.Profesores();
            }else{
              this.global.downloadFile(this.global.ClaseRechazada.user.Correo).then( file => {
                this.global.TempClase.user.Imagen = String(file) + '?' + this.random();
                let profileModal = this.modalCtrl.create(CandidatoClasePage, {}, { cssClass: 'select-modal3' });
                profileModal.present();
              })
            }
          }, 30000);
        })
        .catch(err => console.error(JSON.stringify(err)))
      }).catch( err => console.error(JSON.stringify(err)))
  }

  random(): number {
    let rand = Math.floor(Math.random()*20000000)+1000000;
    return rand;       
  }

  errorAlert() {
    let alert = this.alertCtrl.create({
      title: 'Ups!',
      subTitle: 'No hemos podido localizar ningún profesor disponible :( vuelve a intentarlo más tarde',
      buttons: ['Aceptar']
    });
    alert.present();
  }

}
