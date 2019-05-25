import { SolicitarClaseMapaPage } from './../solicitar-clase-mapa/solicitar-clase-mapa';
import { Clase } from './../../models/Clase';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { GlobalVariablesProvider } from '../../providers/global-variables/global-variables';


@Component({
  selector: 'page-solicitar-clase',
  templateUrl: 'solicitar-clase.html',
})

export class SolicitarClasePage {

  options = [ { id: 1, opcion : "Experto", image : "assets/imgs/Profesor-Experto.png", isSelected : false, style : "none" },
              { id: 2, opcion : "Principiante", image : "assets/imgs/Profesor-Principiante.png", isSelected : false, style : "none" },
              { id: 3, opcion : "Individual", image : "assets/imgs/Clase-Individual.png", isSelected : false, style : "none" },
              { id: 4, opcion : "Grupal", image : "assets/imgs/Clase-Grupal.png", isSelected :  false, style : "none" },
              { id: 5, opcion : "Presencial", image : "assets/imgs/Presencial.png", isSelected : false, style : "none" },
              { id: 6, opcion : "Virtual", image : "assets/imgs/Virtual.png", isSelected : false, style : "none" } ]

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public global : GlobalVariablesProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SolicitarClasePage');
  }

  infoExperto(){
    let alert = this.alertCtrl.create({
      title: 'Profesor Experto',
      subTitle: 'Un profesor experto corresponde a docentes capacitados, con al menos un título de pregrado y una especialización.',
      buttons: ['Aceptar']
    });
    alert.present();
  }

  infoPrincipiante(){
    let alert = this.alertCtrl.create({
      title: 'Profesor Principiante',
      subTitle: 'Un profesor principiante corresponde principalmente a estudiantes de pregrado en proceso hasta especialización en proceso, con alto nivel académico y capacidades innatas de docencia.',
      buttons: ['Aceptar']
    });
    alert.present();
  }

  validation(item : any, id1 : number, id2 : number){
    this.options[id1 -1].style = item.id == id2 && item.isSelected == true ? "none" : this.options[id1 -1].style;
    this.options[id1 -1].isSelected = item.id == id2 && item.isSelected == true ? false : this.options[id1 -1].isSelected;
  }

  itemSelected(item : any){
    item.style = item.style == "none" ? "5px solid #E94F53" : "none";
    item.isSelected = item.isSelected ? false : true;
    this.validation(item,1,2);
    this.validation(item,2,1);
    this.validation(item,3,4);
    this.validation(item,4,3);
    this.validation(item,5,6);
    this.validation(item,6,5);

    var count = 0
    this.options.forEach( element => {
      count = element.isSelected == true ? ++count : count
    })
    if(count == 3){
      this.global.TempClase.opciones = this.options
      if(this.options[5].isSelected){
        console.log("buscar clase");
      }else{
        if(this.options[4].isSelected){
          this.navCtrl.push(SolicitarClaseMapaPage);
        }
      }
    }
  }

}
