import { Usuario } from '../../models/Usuario';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, App } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { GlobalVariablesProvider } from '../../providers/global-variables/global-variables';
import { HomePage } from '../home/home';
import { MenuPage } from '../menu/menu';
import { MateriasProfesorPage } from '../materias-profesor/materias-profesor';
import { ClasesServiceProvider } from '../../providers/clases-service/clases-service';
import { Clase } from '../../models/Clase';

@Component({
  selector: 'page-redes-login',
  templateUrl: 'redes-login.html',
})

export class RedesLoginPage {

  celphone : string;
  teacher : boolean;
  student : boolean;
  facebookid : any;
  name : string;
  email : string;
  tipoUser : number;
  user : any;
  googleid: any;
  imagen: any;
  scholarship: any;
  scholarshipList: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public userService :  UserServiceProvider, public globalV : GlobalVariablesProvider,private appCtrl: App,  public clasesService : ClasesServiceProvider) {
    this.userService.getLevelUserList().then( data => {
      this.scholarshipList = data;
    });
  }

  ionViewDidEnter(){
    this.facebookid = this.navParams.get('facebookId');
    this.googleid = this.navParams.get('googleId');
    this.name = this.navParams.get('name');
    this.email = this.navParams.get('email');
    this.imagen = this.navParams.get('imagen');

    console.log('ionViewDidLoad RedesLoginPage');
  }

  CrearCuenta(){
    let password = this.random();
    if(this.teacher){
      if(this.student){
        if(this.scholarship > 4){
          this.tipoUser = 5; 
        }else{
          this.tipoUser = 4; 
        }    
      }else{
        if(this.scholarship > 4){
          this.tipoUser = 3; 
        }else{
          this.tipoUser = 2; 
        } 
      }
    }else{
      this.tipoUser = 1;
    }
    var data = {
      nombre : this.name,
      psw : btoa(password.toString()), 
      correo : this.email, 
      telefono : this.celphone, 
      facebookid : this.facebookid,
      googleid : this.googleid,
      tipouser : this.tipoUser,
      imagen : this.imagen,
      escolaridad : this.scholarship
    }
    this.userService.createUserRedes(data).then(() =>{
      this.userService.getUserByEmail(this.email).then(user =>{
        this.user = user[0];
        this.globalV.CurrentUser = <Usuario>this.user;
        if(this.globalV.CurrentUser.TipoUsuario == 1){
          this.globalV.TipoIngeso = true;
          this.navCtrl.pop();
          this.appCtrl.getRootNavs()[0].setRoot(MenuPage);
        }else{
          this.globalV.TipoIngeso = false;
          this.navCtrl.pop();
          this.appCtrl.getRootNavs()[0].push(MateriasProfesorPage, { item:true });   
        }
      })
    });
    
  }

  Cancelar(){
    this.navCtrl.pop();
  }

  random(): number {
    let rand = Math.floor(Math.random()*20000000)+1000000;
    return rand;       
 }

}
