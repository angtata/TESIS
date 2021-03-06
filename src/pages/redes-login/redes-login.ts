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
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';

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
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public userService :  UserServiceProvider, public globalV : GlobalVariablesProvider,private appCtrl: App,  public clasesService : ClasesServiceProvider,  private secureStorage: SecureStorage) {
    this.userService.getLevelUserList().then( data => {
      this.scholarshipList = data;
      this.scholarshipList.shift();
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
      this.scholarship = 1;
    }
    var data = {
      Nombre : this.name,
      Contrasena : btoa(password.toString()), 
      Correo : this.email, 
      Telefono : this.celphone, 
      FacebookId : this.facebookid,
      GoogleId : this.googleid,
      TipoUsuario : this.tipoUser,
      Imagen : this.imagen,
      Escolaridad : this.scholarship
    }
    this.userService.createUserRedes(data).then(() =>{
      this.userService.getUserByEmail(this.email).then(user =>{
        this.user = user[0];
        this.globalV.CurrentUser = <Usuario>this.user;
        this.secureStorage.create('login').then((storage: SecureStorageObject) =>{
          storage.set('user', JSON.stringify(this.globalV.CurrentUser))
            .then(() => {console.log("storage!!");})
            .catch(err => { console.error(JSON.stringify(err)); console.log("Awww :(")})
        })
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
