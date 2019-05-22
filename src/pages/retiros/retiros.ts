import { FacturasServiceProvider } from './../../providers/facturas-service/facturas-service';
import { ClasesServiceProvider } from './../../providers/clases-service/clases-service';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { GlobalVariablesProvider } from '../../providers/global-variables/global-variables';
import { EmailProvider } from '../../providers/email-service/email-service';

@Component({
  selector: 'page-retiros',
  templateUrl: 'retiros.html',
})
export class RetirosPage {

  Saldo : any

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public global: GlobalVariablesProvider, public clasesService : ClasesServiceProvider, public facturasService : FacturasServiceProvider, public emailService : EmailProvider) {
    this.getSaldo();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RetirosPage');
  }

  Debitar(){   
    if( this.Saldo > 0 ){
      this.sendEmail().then(()=> {
        this.clasesService.getFacturasByTeacher(this.global.CurrentUser.UsuarioId).then( facturas => {
          var facturasList = Object.keys(facturas).map(function(index){
            let materia = facturas[index];
            return materia;
          });
    
          facturasList = facturasList.filter( (item) => {
            return (item['Estado'] == 0)
          })
    
          facturasList.forEach( element => {
            this.facturasService.updateFacturas({FacturaId : element.FacturaId})
            .then(() => {console.log("Actualizado"); this.getSaldo();})
            .catch( err => console.error(JSON.stringify(err)));
          })
        })
      })
    }else{
      this.notSaldo();
    }
    
  }

  sendEmail(){
    return new Promise ((resolve, reject) => {
      let data = {
        subject : this.global.CurrentUser.NombreCompleto,
        body : `Solicitud de Retiro de: ${this.global.CurrentUser.NombreCompleto}, UsuarioId : ${this.global.CurrentUser.UsuarioId}, Correo : ${this.global.CurrentUser.Correo}, Telefono : ${this.global.CurrentUser.Telefono}, Valor a retirar : ${this.Saldo}` 
      }
      this.emailService.sendRetiro(data)
      .then(()=>{this.confirmationAlert(); resolve()})
      .catch(err =>{this.errorAlert(); reject(err)})
    })
    
  }

  getSaldo(){
    this.clasesService.getSaldoFacturasByTeacher(this.global.CurrentUser.UsuarioId).then( valor => {
      this.Saldo = valor[0]['Saldo'] != null ? valor[0]['Saldo'].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') : 0;
    })
  }

  confirmationAlert(){
    let alert = this.alertCtrl.create({
      title : 'Solicitud de Retiro Generada',
      subTitle: 'Gracias por usar ClaseYA, te enviaremos un correo con las instrucciones para retirar tu dinero.',
      buttons: ['Aceptar']
    });
    alert.present();
  }

  errorAlert() {
    let alert = this.alertCtrl.create({
      title: 'Ups!',
      subTitle: 'No hemos podido enviar los datos de tu retiro, por favor intenta nuevamente',
      buttons: ['Aceptar']
    });
    alert.present();
  }

  notSaldo() {
    let alert = this.alertCtrl.create({
      title: 'Ups!',
      subTitle: 'Parece que no tienes dinero disponible para retirar, intenta más tarde',
      buttons: ['Aceptar']
    });
    alert.present();
  }

}
