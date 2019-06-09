import { Usuario } from './../../models/Usuario';
import { UserServiceProvider } from './../user-service/user-service';
import { Injectable, Injector } from '@angular/core';
import { NotificationsProvider } from '../notifications/notifications';
import { GlobalVariablesProvider } from '../global-variables/global-variables';
import { ModalController, AlertController } from 'ionic-angular';

declare var google;

@Injectable()

export class SolicitarClaseProvider {

  opcionesClase : any;
  listProfes : Usuario[];
  ProfesoresDisponible : any[] = [];

  constructor(public injector: Injector, public users: UserServiceProvider, public global : GlobalVariablesProvider, public modalCtrl: ModalController, private alertCtrl: AlertController) {
    console.log('Hello SolicitarClaseProvider Provider');
  }

  SolicitarClaseP(opciones){
      this.opcionesClase = opciones;
      this.users.getAllTeachers().then( data => {
        this.listProfes = <Usuario[]>data;
        var Profes = this.listProfes.filter( element => {
          return element.EstadoNombre == 'Activo';
        })
        Profes = Profes.filter( element => {
          return element.UsuarioId != this.global.CurrentUser.UsuarioId;
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
          let distance = google.maps.geometry.spherical.computeDistanceBetween(profeUbc, studentUbc);
          distancias.push({user: element.UsuarioId, distancia : distance})
        })
        distancias = distancias.sort(function(a,b) { return a.distancia - b.distancia;})
        this.ProfesoresDisponible = distancias;
        this.Profesores()
    })
  }

  SolicitarClaseV(opciones){
    this.opcionesClase = opciones;
    this.users.getAllTeachers().then( data => {
      this.listProfes = <Usuario[]>data;
      var Profes = this.listProfes.filter( element => {
        return element.EstadoNombre == 'Activo'
      })
      Profes = Profes.filter( element => {
        return element.UsuarioId != this.global.CurrentUser.UsuarioId;
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
      var profesList = [];
      Profes.forEach( element => {
        profesList.push({user: element.UsuarioId})
      })
      this.ProfesoresDisponible = profesList;
      this.Profesores()
    })
  }

  Profesores(){
    console.log(JSON.stringify(this.ProfesoresDisponible))
    if(this.ProfesoresDisponible.length > 0){
      this.ValidarProfe(this.ProfesoresDisponible[this.ProfesoresDisponible.length -1].user, this.opcionesClase)
    }else{
      this.errorAlert();
    }
  }

  ValidarProfe(user, opciones){
      var notificaciones = this.injector.get(NotificationsProvider)
      notificaciones.getTokenUser(user).then( data => {
        let token = data[0].FCM_Token
        opciones.hora = new Date();
        notificaciones.sendNotification(token,opciones,{ titulo : "¡Hay una Clase Disponible!" , cuerpo : `¡Acepta dictarle una clase a ${opciones.user.NombreCompleto}!`})
        .then( () => { this.RechazarTimeOut(35000); console.log("rechazar 1") })
        .catch(err => { this.Rechazar(1); console.log("rechazar 2")  })
      }).catch( err => { this.Rechazar(1); console.log("rechazar 3")  })
  }

  random(): number {
    let rand = Math.floor(Math.random()*20000000)+1000000;
    return rand;       
  }

  Rechazar(time: number){
    setTimeout( () => { 
      this.ProfesoresDisponible.pop(); 
      this.Profesores();
    }, time ) 
  }

  RechazarTimeOut(time: number){
    setTimeout( () => {
      if(this.global.ClaseRechazada.rechazar == null){
        console.log("rechazar 4")
        this.ProfesoresDisponible.pop(); 
        this.Profesores();
      }
    }, time ) 
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
