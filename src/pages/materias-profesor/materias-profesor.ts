import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController, App } from 'ionic-angular';
import { MateriasServiceProvider } from '../../providers/materias-service/materias-service';
import { GlobalVariablesProvider } from '../../providers/global-variables/global-variables';
import { EmailProvider } from '../../providers/email-service/email-service';
import { HomePage } from '../home/home';
import { MenuPage } from '../menu/menu';


@Component({
  selector: 'page-materias-profesor',
  templateUrl: 'materias-profesor.html',
})

export class MateriasProfesorPage {
  
  items: any;
  allItems: any
  searchQuery: string = '';
  selectedItems : any[] = [];
  ingreso: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public materiasService : MateriasServiceProvider, public global : GlobalVariablesProvider, private alertCtrl: AlertController, public email : EmailProvider, public modalCtrl: ModalController,private appCtrl: App) {
    this.ingreso = navParams.get('item');    
    this.materiasService.getMateriasList().then( data => {
      this.allItems = data;
      this.items = data;
    });
    
  }

  ionViewDidEnter() {
    if(this.global.SelectedMaterias != undefined){
      this.selectedItems = this.global.SelectedMaterias;
    }
    console.log('ionViewDidLoad MateriasProfesorPage');
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
    if(this.selectedItems.find(function(element){ return element.MateriaId == item.MateriaId})){
      this.selectedItems = this.arrayRemove(this.selectedItems,item)
    }else{
      this.selectedItems.push(item);
    }
  }

  isSelected(item){
    if(this.selectedItems.find(function(element){ return element.MateriaId == item.MateriaId}) == null){
      return false;
    }else{
      return true;
    }
  }


  arrayRemove(arr, value) {
    return arr.filter(function(ele){
        return ele.MateriaId != value.MateriaId;
    });
  }

  OkMaterias(){
    this.navCtrl.pop();
    this.global.SelectedMaterias = this.selectedItems;
    if (this.ingreso){
      this.materiasService.deleteMateriasUser(this.global.CurrentUser.UsuarioId).then(()=>{
        this.global.SelectedMaterias.forEach(element => {
          let data = { MateriaId : element.MateriaId, UsuarioId : this.global.CurrentUser.UsuarioId.toString() }
          this.materiasService.InsertMateriaUsuario(data).then(() => console.log("Materia Asociada")).catch( err => console.error(err) )
        });
      }).catch(err => console.error(JSON.stringify(err)));
      if (this.global.CurrentUser.TipoUsuario == 4){
        let profileModal = this.modalCtrl.create(HomePage, {}, {cssClass: 'select-modal' });
        profileModal.present();
      } 
      else {this.appCtrl.getRootNavs()[0].setRoot(MenuPage);}
    }
  }

  addMateria(){
    let alert = this.alertCtrl.create({
      title: 'Adicionar Nueva Materia',
      inputs:[{
        name : 'Materia',
        placeholder: 'Materia',
        label: 'Materia'
      },{
        name : 'Area',
        placeholder : 'Área',
        label : 'Área'
      }],
      buttons: [{
        text: 'Adicionar',
        handler: data => { this.sendEmail(data) }
      }]
    });
    alert.present();
  }

  sendEmail(data){
    let send = {
      subject : "Adicionar Materia",
      body : `Materia : ${data.Materia} , Area : ${data.Area}, Nombre : ${this.global.TempName != null ? this.global.TempName : this.global.CurrentUser.NombreCompleto}, Correo : ${this.global.TempEmail != null ? this.global.TempEmail : this.global.CurrentUser.Correo}, Telefono : ${this.global.TempPhone != null ? this.global.TempPhone : this.global.CurrentUser.Telefono}`
    }
    this.email.sendAddMateria(send)
    .then(() =>{this.confirmationAlert()})
    .catch(err =>{console.error(JSON.stringify(err)); this.errorAlert()})
  }

  confirmationAlert(){
    let alert = this.alertCtrl.create({
      title : 'Materia Agregada',
      subTitle: '¡Gracias! Adicionaremos la materia en nuestra base de datos después de unas validaciones ;)',
      buttons: ['Continuar']
    });
    alert.present();
  }

  errorAlert() {
    let alert = this.alertCtrl.create({
      title: 'Ups!',
      subTitle: 'No hemos podido enviar los datos de tu materia, por favor intenta nuevamente',
      buttons: ['Aceptar']
    });
    alert.present();
  }
}
