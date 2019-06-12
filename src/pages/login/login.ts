import { UpdatePasswordPage } from './../update-password/update-password';
import { GooglePlus } from '@ionic-native/google-plus';
import { RedesLoginPage } from '../redes-login/redes-login';
import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, ModalController, App, Platform} from 'ionic-angular';
import { HomePage } from './../home/home'
import { RegistroPage } from './../registro/registro';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { GlobalVariablesProvider } from '../../providers/global-variables/global-variables';
import { Usuario } from '../../models/Usuario';
import { MenuPage } from '../menu/menu';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { EmailProvider } from '../../providers/email-service/email-service';
import { NotificationsProvider } from '../../providers/notifications/notifications';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  email : any;
  password : any;

  constructor( private platform: Platform, private geolocation: Geolocation, private fb: Facebook, public notificatios : NotificationsProvider, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public userService :  UserServiceProvider, private alertCtrl: AlertController, public globalV : GlobalVariablesProvider, private appCtrl: App, private googlePlus: GooglePlus, private emailServie : EmailProvider, private secureStorage: SecureStorage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  Login(){
    this.userService.loginService(this.email, btoa(this.password)).then(data =>{
      let user = data[0];
      if(user.FailLogin == 0 ){
        this.errorAlert();
      }else{
        this.SuperLogin(user.NombreCompleto, user.Correo, 0,0, 'assets/imgs/User.png')
      }
    }).catch( e => {
      this.errorAlert();
      console.log("Error Login", JSON.stringify(e));
    })
  }

  FacebookLogin(){
    this.fb.login(['public_profile', 'email'])
    .then((res: FacebookLoginResponse) => {
      let params = new Array();
      this.fb.api("me?fields=id,name,email,picture.width(720).height(720).as(picture_large)", params).then(
        user =>{
          this.SuperLogin(user.name,user.email,0,user.id,user.picture_large.data.url)
        }
      ).catch( e=> {
        this.errorAlert();
        console.log('Error logging into Facebook', JSON.stringify(e))
      })
    })
    .catch(e => {
      this.errorAlert();
      console.log('Error logging into Facebook', JSON.stringify(e))
    });
  }

  GoogleLogin(){
    this.googlePlus.login({ 'scopes': '', 'offline': true}).then( user => {
      this.SuperLogin(user.displayName,user.email,user.userId,0,'assets/imgs/User.png')
    }).catch( err => { 
      this.errorAlert();
      console.log('Error logging into Google', JSON.stringify(err));
    })  
  }

  SuperLogin(nombre : string, correo : string, idgoogle ?: number, idfacebook ?: number, imagen ?: string){
    this.userService.getUserByEmail(correo).then( data =>{
      let user = data[0];
      if (user != undefined){
        this.globalV.CurrentUser = <Usuario>user;
        this.secureStorage.create('login').then((storage: SecureStorageObject) =>{
          storage.set('user', JSON.stringify(this.globalV.CurrentUser))
            .then(() => {console.log("storage!!");})
            .catch(err => { console.error(JSON.stringify(err)); console.log("Awww :(")})
        })
        this.notificatios.getToken(this.globalV.CurrentUser.UsuarioId);
        if(this.globalV.CurrentUser.TipoUsuario == 4 || this.globalV.CurrentUser.TipoUsuario == 5){
          let profileModal = this.modalCtrl.create(HomePage, {}, {cssClass: 'select-modal' });
          profileModal.present();
        }else{
          this.globalV.TipoIngeso = this.globalV.CurrentUser.TipoUsuario == 1 ? true : false;
          this.appCtrl.getRootNavs()[0].setRoot(MenuPage);
        }
        
      }else{
        let redesModal = this.modalCtrl.create(RedesLoginPage, 
          { 
            name : nombre, 
            email : correo, 
            googleId : idgoogle, 
            facebookId : idfacebook, 
            imagen : imagen
          }, 
            {cssClass: 'select-modal' });
        redesModal.present();
      } 
    }).catch( e => {
      this.errorAlert();
    })
  }

  Psw(){
    let alert = this.alertCtrl.create({
      title: 'Recuperar Contraseña',
      subTitle: 'Ingresa tu correo para enviarte un PIN de recuperación, ¡No olvides validar en Spam!',
      inputs:[{
        name : 'Correo',
        placeholder: 'Correo',
        label: 'Correo'
      }],
      buttons: [{
        text: 'Enviar PIN',
        handler: data => {  
          this.userService.getUserByEmail(data.Correo).then( usr => {
            let user = usr[0]
            if( user != undefined){
              let email = data.Correo;
              let req = {
                Correo : data.Correo,
                userId : user.UsuarioId
              }
              this.emailServie.sendResetPww(req)
              .then( () => {this.PinAlert(user, email);})
              .catch( (e) => { console.log(JSON.stringify(e)); this.errorAlert() })
            }else{
              console.log("es undefine")
              this.errorAlert();
            }
          })
        }
      }]
    });
    alert.present();
  }

  PinAlert(user: { UsuarioId: any; }, email: any){
    let alert = this.alertCtrl.create({
      title: '¡Ingresa tu PIN!',
      inputs:[{
        name : 'PIN',
        placeholder: 'PIN',
        label: 'PIN',
        type: 'number'
      }],
      buttons: [{
        text: 'Aceptar',
        handler: data => {
          this.emailServie.getToken(user.UsuarioId)
          .then(PIN => {
            if( data.PIN == PIN[0].token){
              var mins = Math.floor( (new Date().getTime() - new Date(PIN[0].date).getTime()) /60000);
              if (mins > 10){
                this.errorAlert();
              }else{
                this.emailServie.updateToken(user.UsuarioId)
                .then( () => {
                  let passwordModal = this.modalCtrl.create(UpdatePasswordPage, {email : email}, {cssClass: 'select-modal' });
                  passwordModal.present();
                })
                .catch( () => this.errorAlert() )
              }
            }else{
              this.PINerrorAlert();
            }
          }).catch(() => this.errorAlert())
        }
      }]
    });
    alert.present();
  }

  Registro(){
    this.navCtrl.push(RegistroPage)
  }

  errorAlert() {
    let alert = this.alertCtrl.create({
      title: 'Ups!',
      subTitle: 'No hemos podido ingresar con tus datos, por favor intenta nuevamente',
      buttons: ['Aceptar']
    });
    alert.present();
  }

  PINerrorAlert(){
    let alert = this.alertCtrl.create({
      title: 'Ups!',
      subTitle: 'El código que ingresaste no existe o ya se encuentra expirado, por favor intenta nuevamente',
      buttons: ['Aceptar']
    });
    alert.present();
  }

  

}
