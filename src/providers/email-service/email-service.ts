import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Configuracion } from '../../app/app.configuration';

@Injectable()
export class EmailProvider {

  constructor(public http: Http) {
    console.log('Hello EmailProvider Provider');
  }

  sendAddMateria(data){
    return new Promise((resolve, reject) =>{
      let params = { subject: data.subject, body : data.body}
      this.http.post(`${Configuracion.URL}email`,params).subscribe( data =>{
        resolve(data);
      }, err => { reject(err)})
    })
  }

  sendResetPww(data){
    return new Promise((resolve, reject) =>{
      let params = { email : data.Correo, user : data.userId}
      this.http.post(`${Configuracion.URL}email/psw`,params).subscribe( data =>{
        resolve(data);
      }, err => { reject(err)})
    })
  }

  getToken(userId){
    return new Promise((resolve, reject) =>{
      let params = { UsuarioId : userId}
      this.http.post(`${Configuracion.URL}email/token`,params).subscribe( data =>{
        resolve(data.json());
      }, err => { reject(err)})
    })
  }

  updateToken(userId){
    return new Promise((resolve, reject) =>{
      let params = { UsuarioId : userId}
      this.http.post(`${Configuracion.URL}email/updateToken`,params).subscribe( data =>{
        resolve(data.json());
      }, err => { reject(err)})
    })
  }

  sendRetiro(data){
    return new Promise((resolve, reject) =>{
      let params = { subject: data.subject, body : data.body}
      this.http.post(`${Configuracion.URL}email/retiros`,params).subscribe( data =>{
        resolve(data);
      }, err => { reject(err)})
    })
  }

}
