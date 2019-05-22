import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Configuracion } from '../../app/app.configuration';


@Injectable()
export class ClasesServiceProvider {

  constructor(public http: Http) {
    console.log('Hello ClasesServiceProvider Provider');
  }

  getAllClasesList(){
    return new Promise((resolve, reject) => {
      this.http.get(`${Configuracion.URL}clases`).subscribe( data =>{
        resolve(data.json());
      }, err =>{ reject(err) })
    });
  }

  getClasesListByTeacher(teacher : string){
    return new Promise((resolve, reject) => {
      this.http.get(`${Configuracion.URL}clases/profesor/${teacher}`).subscribe( data =>{
        resolve(data.json());
      }, err =>{ reject(err) })
    });
  }

  getClasesListByStudent(student : string){
    return new Promise((resolve, reject) => {
      this.http.get(`${Configuracion.URL}clases/estudiante/${student}`).subscribe( data =>{
        resolve(data.json());
      }, err =>{ reject(err) })
    });
  }

  calificarStudent(data : any){
    return new Promise((resolve, reject) =>{
      let options = data
      this.http.post(`${Configuracion.URL}clases/estudiante/`,options).subscribe( data => {
        resolve(data.json());
      }, err => { reject(err)})
    });
  }

  calificarTeacher(data : any){
    return new Promise((resolve, reject) =>{
      let options = data
      this.http.post(`${Configuracion.URL}clases/profesor/`,options).subscribe( data => {
        resolve(data.json());
      }, err => { reject(err)})
    });
  }

  getFacturasByTeacher(profesor : string){
    return new Promise((resolve, reject) =>{
      this.http.get(`${Configuracion.URL}clases/factura/profesor/${profesor}`).subscribe( data => {
        resolve(data.json());
      }, err => { reject(err)})
    });
  }

  getFacturasByStudent(estudiante : string){
    return new Promise((resolve, reject) =>{
      this.http.get(`${Configuracion.URL}clases/estudiante/profesor/${estudiante}`).subscribe( data => {
        resolve(data.json());
      }, err => { reject(err)})
    });
  }

  getFacturasByClase(claseId : string){
    return new Promise((resolve, reject) =>{
      this.http.get(`${Configuracion.URL}clases/factura/${claseId}`).subscribe( data => {
        resolve(data.json());
      }, err => { reject(err)})
    });
  }

  getSaldoFacturasByTeacher(profesor : string){
    return new Promise((resolve, reject) =>{
      this.http.get(`${Configuracion.URL}clases/factura/Saldoprofesor/${profesor}`).subscribe( data => {
        resolve(data.json());
      }, err => { reject(err)})
    });
  }

}
