import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Configuracion } from '../../app/app.configuration';


@Injectable()
export class FacturasServiceProvider {

  constructor(public http: Http) {
    console.log('Hello FacturasServiceProvider Provider');
  }

  createFacturas(data : any){
    return new Promise((resolve, reject) =>{
      let options = data
      this.http.post(`${Configuracion.URL}facturas`,options).subscribe( data => {
        resolve(data.json());
      }, err => { reject(err)})
    });
  }

  updateFacturas(data : any){
    return new Promise((resolve, reject) =>{
      let options = data;
      this.http.post(`${Configuracion.URL}facturas/update`,options).subscribe( data => {
        resolve(data.json());
      }, err => { reject(err)})
    });
  }

}
