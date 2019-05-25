import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MateriasServiceProvider } from '../../providers/materias-service/materias-service';
import { GlobalVariablesProvider } from '../../providers/global-variables/global-variables';
import { SolicitarClasePage } from '../solicitar-clase/solicitar-clase';

@Component({
  selector: 'page-materias-estudiante',
  templateUrl: 'materias-estudiante.html',
})

export class MateriasEstudiantePage {
  
  items: any;
  allItems: any
  searchQuery: string = '';
  selectedItems : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public materiasService : MateriasServiceProvider, public global : GlobalVariablesProvider) {
    this.materiasService.getMateriasList().then( data => {
      this.allItems = data;
      this.items = data;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MateriasEstudiantePage');
  }

  initializeItems() {
    this.items = this.allItems;
  }

  getItems(ev: any) {
    this.initializeItems();
    const val = ev.target.value;

    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.Materia.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  itemSelected(item){
    this.selectedItems = this.selectedItems == item ? this.selectedItems : item;
  }

  isSelected(item){
    if( this.selectedItems == item ){
      return true;
    }else{
      return false;
    }
  }

  OkMaterias(){
    this.global.TempClase.materia = this.selectedItems;
    this.navCtrl.push(SolicitarClasePage);
  }

}
