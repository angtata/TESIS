import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Configuracion } from '../../app/app.configuration';


@Injectable()
export class UserServiceProvider {

  constructor(public http: Http) {
  }

  loginService(Correo : any, Contrasena: any) { 
    return new Promise( (resolve, reject) =>{
      this.http.post( `${Configuracion.URL}usuarios/login`,{Correo, Contrasena}).subscribe(data => { 
        resolve(data.json());
      }, err =>{ reject(err) })
    });
  }

  getUsersList() {
    return new Promise((resolve, reject) => {
      this.http.get(`${Configuracion.URL}usuarios`).subscribe( data =>{
        resolve(data.json());
      }, err =>{ reject(err) })
    });
  }

  getUserById(UserId){
    return new Promise((resolve, reject) => {
      this.http.get(`${Configuracion.URL}usuarios/usuarioid/${UserId}`).subscribe( data =>{
        resolve(data.json());
      }, err =>{ reject(err) })
    });
  }

  getUserByEmail(email){
    return new Promise((resolve, reject) => {
      this.http.get(`${Configuracion.URL}usuarios/user/${email}`).subscribe( data =>{
        resolve(data.json());
      }, err =>{ reject(err) })
    });
  }

  createUserRedes(data){
    return new Promise((resolve, reject) =>{
      let params = {Nombre : data.nombre, Contrasena : data.psw, Correo : data.correo, Telefono : data.telefono, FacebookId : data.facebookid, TipoUsuario  : data.tipouser, GoogleId: data.googleid, Imagen : data.imagen, Escolaridad : data.escolaridad}
      this.http.post(`${Configuracion.URL}usuarios/`,params).subscribe( data =>{
        resolve(data);
      }, err =>{ reject(err) })
    })
  }

  createUser(data){
    return new Promise((resolve, reject) =>{
      let params = {Nombre : data.nombre, Contrasena : data.psw, Correo : data.correo, Telefono : data.telefono, TipoUsuario  : data.tipouser, Imagen : data.imagen, Escolaridad : data.escolaridad}
      this.http.post(`${Configuracion.URL}usuarios/`,params).subscribe( data =>{
        resolve(data);
      }, err =>{ reject(err) })
    })
  }

  updatePsw(data){
    return new Promise((resolve, reject) =>{
      let params = {UsuarioId  : data.userId, Contrasena : data.psw}
      this.http.post(`${Configuracion.URL}usuarios/Pass`,params).subscribe( data =>{
        resolve(data);
      }, err =>{ reject(err) })
    })
  }

  getLevelUserList(){
    return new Promise( (resolve, reject) =>{
      this.http.post( `${Configuracion.URL}usuarios/escolaridad`,{}).subscribe(data => { 
        resolve(data.json());
      }, err =>{ reject(err) })
    });
  }

  updateActivoClase(data){
    return new Promise( (resolve, reject) =>{
      let params = { UsuarioId : data.UsuarioId, ActivoClase : data.estado }
      this.http.post( `${Configuracion.URL}usuarios/activoclase`, params).subscribe(data => { 
        resolve(data.json());
      }, err =>{ reject(err) })
    });
  }

  updateUser(params){
    return new Promise( (resolve, reject) =>{
      this.http.post( `${Configuracion.URL}usuarios/update`, params).subscribe(data => { 
        resolve(data.json());
      }, err =>{ reject(err) })
    });
  }

  getAllTeachers(){
    return new Promise ((resolve, reject) => {
      this.http.get(`${Configuracion.URL}usuarios/profesores`).subscribe(data => {
        resolve(data.json());
      }, err => { reject(err) })
    })
  }

}

