import { MatchPage } from './../pages/match/match';
import { MenuPage } from './../pages/menu/menu';
import { GlobalVariablesProvider } from './../providers/global-variables/global-variables';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from './../pages/login/login';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { HomePage } from '../pages/home/home';
import { FCM } from '@ionic-native/fcm';
import { SolicitudClasePage } from '../pages/solicitud-clase/solicitud-clase';
import { SolicitarClaseProvider } from '../providers/solicitar-clase/solicitar-clase';
import { CandidatoClasePage } from '../pages/candidato-clase/candidato-clase';
import { ClasesServiceProvider } from '../providers/clases-service/clases-service';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { Clase } from '../models/Clase';
import { Usuario } from '../models/Usuario';


@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  tipoIngreso: boolean = false;
  

  constructor(private fcm: FCM, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private secureStorage: SecureStorage, private global : GlobalVariablesProvider, public modalCtrl: ModalController, private solicitarClase : SolicitarClaseProvider, private alertCtrl: AlertController, private clasesServices : ClasesServiceProvider, private userService : UserServiceProvider) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.recibeNotificaciones();
      this.secureStorage.create('login').then((storage: SecureStorageObject) =>{
        storage.get('user')
          .then( data => {
            this.global.CurrentUser = JSON.parse(data); 
            if( JSON.stringify(this.global.CurrentClase) == null){
              if(this.global.CurrentUser.TipoUsuario == 4 || this.global.CurrentUser.TipoUsuario == 5){
                this.rootPage = LoginPage;
                let profileModal = this.modalCtrl.create(HomePage, {}, {cssClass: 'select-modal' });
                profileModal.present();
              }else{
                this.global.TipoIngeso = this.global.CurrentUser.TipoUsuario == 1 ? true : false;
                this.rootPage = MenuPage; 
              }
            }else{
              this.rootPage = MenuPage; 
            }
            
          })
          .catch(err => { console.error(JSON.stringify(err)); this.rootPage = LoginPage; })
      })
    });
  }

  recibeNotificaciones() {
    this.fcm.onNotification().subscribe(data => {
      let value = JSON.parse(data.value)
      if(!this.global.TipoIngeso){
        this.recibeNotificacionProfe(value);
      }else{
        this.recibeNotificacionEstud(value);
      }
    });
  }

  recibeNotificacionProfe(value){
    if(value.rechazar == undefined){
      this.global.TempClase = value;
      var d1 = new Date(this.global.TempClase.hora)
      var d2 = new Date()
      var diference = d2.getTime() - d1.getTime() 
      if ( diference < 30000 ){
        this.global.downloadFile(this.global.TempClase.user.Correo).then( file => {
          this.global.TempClase.user.Imagen = String(file) + '?' + this.random();
          let profileModal = this.modalCtrl.create(SolicitudClasePage, {}, { cssClass: 'select-modal2' });
          profileModal.present();
        })
      }
    }else{
      this.global.ClaseRechazada = value;
      if(this.global.ClaseRechazada.rechazar){
        this.errorAlert();
      }else{
        this.Match();
      }
    }
  }

  recibeNotificacionEstud(value){
    this.global.ClaseRechazada = value;
    if(this.global.ClaseRechazada.rechazar){
      this.solicitarClase.ProfesoresDisponible.pop();
      this.solicitarClase.Profesores();
    }else{
      this.global.downloadFile(this.global.ClaseRechazada.user.Correo).then( file => {
        this.global.TempClase.user.Imagen = String(file) + '?' + this.random();
        let profileModal = this.modalCtrl.create(CandidatoClasePage, {}, { cssClass: 'select-modal3' });
        profileModal.present();
        profileModal.onWillDismiss( data => {
          this.nav.setRoot(MyApp);
          this.nav.popToRoot();
        })
      })
    }
  }

  random(): number {
    let rand = Math.floor(Math.random()*20000000)+1000000;
    return rand;       
  }

  errorAlert() {
    let alert = this.alertCtrl.create({
      title: 'Ups!',
      subTitle: 'El estudiante ha declinado tu oferta',
      buttons: ['Aceptar']
    });
    alert.present();
  }

  Match(){
    this.clasesServices.getClasesListByTeacher(this.global.CurrentUser.UsuarioId)
    .then( clases => { 
      this.global.CurrentClase  = <Clase>clases[0]; 
      this.userService.getUserById(this.global.CurrentClase.Estudiante).then( profe => {
        this.global.CurrentClase.Estudiante = <Usuario>profe[0];
        this.global.CurrentClase.Profesor = this.global.CurrentUser;
        this.nav.push(MatchPage)
        this.global.downloadFile(this.global.CurrentClase.Estudiante.Correo).then( url => {
          this.global.CurrentClase.Estudiante.Imagen = String(url);
        }).catch(()=>{ this.global.CurrentClase.Estudiante.Imagen = "assets/imgs/User.png"});
      }).catch( err => { console.log(JSON.stringify(err))})
    }).catch( err => console.log(JSON.stringify(err)) )
  }
  
}
