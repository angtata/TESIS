import { NotificationsProvider } from './../../providers/notifications/notifications';
import { LoginPage } from './../login/login';
import { DashboardPage } from './../dashboard/dashboard';
import { DashboardEstudiantePage } from './../dashboard-estudiante/dashboard-estudiante';
import { GlobalVariablesProvider } from './../../providers/global-variables/global-variables';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Nav, App } from 'ionic-angular';
import { PagosConfigPage } from '../pagos-config/pagos-config';
import { ClasesListPage } from '../clases-list/clases-list';
import { RetirosPage } from '../retiros/retiros';
import { HelpPage } from '../help/help';
import { ContactUsPage } from '../contact-us/contact-us';
import { ClasesServiceProvider } from '../../providers/clases-service/clases-service';
import { Clase } from '../../models/Clase';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { Usuario } from '../../models/Usuario';
import { ProfilePage } from '../profile/profile';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  pages: Array<{title: string, component: any, icon : string}>;
  
  constructor(public navCtrl: NavController, public global : GlobalVariablesProvider, public clasesService : ClasesServiceProvider, public userService :  UserServiceProvider, private secureStorage: SecureStorage, private appCtrl: App, private notificaciones : NotificationsProvider) {
    
  }

  ionViewDidEnter(){
    if(this.global.TipoIngeso || this.global.CurrentUser.TipoUsuario == 1){
      this.global.TipoIngeso = true;    
      this.clasesService.getClasesListByStudent(this.global.CurrentUser.UsuarioId)
      .then( data =>{ 
        this.global.Clases = <Clase[]> data;
        this.LoadStudentClases(this.global.Clases).then(() => {
          this.rootPage = DashboardEstudiantePage;
          this.pages = [
            { title: 'Pagos', component: PagosConfigPage, icon: "card" },
            { title: 'Mis Clases', component: ClasesListPage, icon : "bookmarks"}
          ];
        })
      }).catch( err => { console.log(JSON.stringify(err))})
      
    }else{
      this.global.TipoIngeso = false;    
      this.clasesService.getClasesListByTeacher(this.global.CurrentUser.UsuarioId)
      .then( data =>{ 
        this.global.Clases = <Clase[]> data;
        this.LoadTeacherClases(this.global.Clases).then(()=>{
          this.rootPage = DashboardPage;
          this.pages = [
            { title: 'Mi Saldo', component: RetirosPage, icon: "card" },
            { title: 'Mis Clases', component: ClasesListPage, icon : "bookmarks" }
          ];
        })
      }).catch( err => { console.log(JSON.stringify(err))})
    }
  }

  LoadStudentClases(array) {
    var appthis = this;
    return array.reduce(function(promise, clase) {
        return promise.then(function() {
            return appthis.userService.getUserById(clase.Profesor).then( profe => { 
              clase.Profesor = <Usuario>profe[0];
              clase.Estudiante = appthis.global.CurrentUser;
              appthis.global.downloadFile(clase.Profesor.Correo).then( url => {
                clase.Profesor.Imagen = String(url);
              }).catch(()=>{ clase.Profesor.Imagen = "assets/imgs/User.png"})
            }).catch(err => Promise.reject(err))
        });
    }, Promise.resolve());
  }

  LoadTeacherClases(array) {
    var appthis = this;
    return array.reduce(function(promise, clase) {
        return promise.then(function() {
            return appthis.userService.getUserById(clase.Estudiante).then( estud => { 
              clase.Estudiante = <Usuario>estud[0];
              clase.Profesor = appthis.global.CurrentUser;
              appthis.global.downloadFile(clase.Estudiante.Correo).then( url => {
                clase.Estudiante.Imagen = String(url);
              }).catch(()=>{ clase.Estudiante.Imagen = "assets/imgs/User.png"})
            }).catch(err => Promise.reject(err))
        });
    }, Promise.resolve());
  }

  openPage(page) {
    this.nav.push(page.component);
  }
  
  openPageHelp() {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(HelpPage);
  }

  openPageContact() {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(ContactUsPage);
  }

  openProfile(){
    this.nav.push(ProfilePage)
  }

  LoggOut(){
    this.appCtrl.getRootNavs()[0].setRoot(LoginPage);
    this.notificaciones.updateToken({ Token: '', UsuarioId : this.global.CurrentUser.UsuarioId })
    this.secureStorage.create('login')
    .then((storage: SecureStorageObject) => {
      storage.remove('user')
     .then( data => console.log(data))
     .catch(error => console.log(error))
    })
  }

}
