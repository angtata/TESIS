import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Configuracion } from '../../app/app.configuration';

@Injectable()
export class MateriasServiceProvider {

  constructor(public http: Http) {
  }

  getMateriasList(){
    return new Promise((resolve, reject) => {
      this.http.get(`${Configuracion.URL}materias`).subscribe( data =>{
        resolve(data.json());
      }, err =>{ reject(err) })
    });
  }

  getMateriasUserList(user : string){
    return new Promise((resolve, reject) => {
      this.http.get(`${Configuracion.URL}materias/${user}`).subscribe( data =>{
        resolve(data.json());
      }, err =>{ reject(err) })
    });
  }

  deleteMateriasUser(user : string){
    return new Promise((resolve, reject) =>{
      let params = {UsuarioId : user}
      this.http.post(`${Configuracion.URL}materias/usuario`,params).subscribe( data =>{
        resolve(data);
      }, err =>{ reject(err) })
    })
  }

  InsertMateriaUsuario(data){
    return new Promise((resolve, reject) =>{
      let params = {MateriaId : data.MateriaId, UsuarioId : data.UsuarioId}
      this.http.post(`${Configuracion.URL}materias`,params).subscribe( data =>{
        resolve(data);
      }, err =>{ reject(err) })
    })
  }

}
