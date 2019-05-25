import { Usuario } from './../../models/Usuario';
import { UserServiceProvider } from './../user-service/user-service';
import { Injectable } from '@angular/core';

declare var google;

@Injectable()
export class SolicitarClaseProvider {

  listProfes : Usuario[]
  constructor(public users : UserServiceProvider) {
    console.log('Hello SolicitarClaseProvider Provider');
  }

  SolicitarClaseP(opciones){
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
    })
  }

}
