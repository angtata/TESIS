import { MateriasServiceProvider } from './../../providers/materias-service/materias-service';
import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { GlobalVariablesProvider } from '../../providers/global-variables/global-variables';
import { ViewController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-match',
  templateUrl: 'match.html',
})

export class MatchPage {

  materias : any = []; 

  constructor(public viewCtrl: ViewController, public platform: Platform, public alertCtrl : AlertController, public navCtrl: NavController, public navParams: NavParams, public global : GlobalVariablesProvider, public materiasService : MateriasServiceProvider, private iab: InAppBrowser) {
    //this.platform.registerBackButtonAction(() => { this.Alert(); })
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad MatchPage');
    this.materiasService.getMateriasUserList(this.global.CurrentClase.Profesor.UsuarioId).then( data => {
      var materiasList = Object.keys(data).map(function(index){
        let materia = data[index];
        return materia;
      });
      materiasList.forEach( element => {
        this.materias.push(element['Materia'])
      })                        
    })
  }

  ionViewDidLeave(){
    this.global.CurrentClase = null;
  }

  Alert() {
    let alert = this.alertCtrl.create({
      title: '¡Espera!',
      subTitle: '¿Estas seguro que te quieres salir? Si lo haces perderás toda la información de contacto del estudiante. Asegurate de contactar tu estudiante antes de salir ;)',
      buttons: [
        { text: 'Aceptar',
          handler: () => {
            this.navCtrl.pop();
          }
        },{
          text: 'Cancelar',
          handler: () => {
            
          }
        }
      ]
    });
    alert.present();
  }

}
