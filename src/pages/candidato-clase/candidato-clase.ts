import { UserServiceProvider } from './../../providers/user-service/user-service';
import { Clase } from './../../models/Clase';
import { ClasesServiceProvider } from './../../providers/clases-service/clases-service';
import { SolicitarClaseProvider } from './../../providers/solicitar-clase/solicitar-clase';
import { Component } from '@angular/core';
import { NavController, NavParams, App, ModalController } from 'ionic-angular';
import { GlobalVariablesProvider } from '../../providers/global-variables/global-variables';
import { NotificationsProvider } from '../../providers/notifications/notifications';
import { Usuario } from '../../models/Usuario';

@Component({
  selector: 'page-candidato-clase',
  templateUrl: 'candidato-clase.html',
})
export class CandidatoClasePage {

  constructor(private appCtrl: App, public solicitar : SolicitarClaseProvider, public notificaciones: NotificationsProvider, public navCtrl: NavController, public navParams: NavParams,  public global : GlobalVariablesProvider,  public modalCtrl: ModalController, public clasesServices : ClasesServiceProvider, public userService : UserServiceProvider) {
  }

  ionViewDidEnter() { 
    this.navCtrl.remove(this.appCtrl.getActiveNav().getPrevious().index);
    console.log('ionViewDidLoad CandidatoClasePage');
  }

  Rechazar(){
    this.navCtrl.pop();
    var UsuarioId = this.global.ClaseRechazada.user.UsuarioId;
    this.global.ClaseRechazada = { user : this.global.CurrentUser, rechazar : true}
    this.Notificar(UsuarioId);
    console.log("rechazar 7")
  }

  Seguir(){
    this.navCtrl.pop();
    var UsuarioId = this.global.ClaseRechazada.user.UsuarioId;
    this.global.ClaseRechazada = { user : this.global.CurrentUser, rechazar : true}
    this.Notificar(UsuarioId);
    console.log("rechazar 6")
    this.solicitar.ProfesoresDisponible.pop();
    this.solicitar.Profesores();
  }

  Aceptar(){
    
    var fecha = new Date();
    fecha.setHours( fecha.getHours() - 5 );
    var clase = {
      Profesor : this.global.ClaseRechazada.user.UsuarioId, 
      Estudiante : this.global.CurrentUser.UsuarioId, 
      MateriaId : this.global.TempClase.materia['MateriaId'],
      TipoClase : this.global.TempClase.opciones[2].isSelected == true ? 0 : 1, 
      Direccion : this.global.TempClase.direccion, 
      Latitud : this.global.TempClase.ubicacion['lat'], 
      Longitud : this.global.TempClase.ubicacion['lng'],
      FechaHora : fecha
    }
    this.clasesServices.createClase(clase)
      .then( () => {
        this.clasesServices.getClasesListByStudent(this.global.CurrentUser.UsuarioId)
        .then( clases => { 
          this.global.CurrentClase  = <Clase>clases[0]; 
          this.userService.getUserById(this.global.CurrentClase.Profesor).then( profe => {
            this.global.CurrentClase.Profesor = <Usuario>profe[0];
            this.global.CurrentClase.Estudiante = this.global.CurrentUser;
            this.navCtrl.pop();
            this.global.downloadFile(this.global.CurrentClase.Profesor.Correo).then( url => {
              this.global.CurrentClase.Profesor.Imagen = String(url);
            }).catch(()=>{ this.global.CurrentClase.Profesor.Imagen = "assets/imgs/User.png"});
          }).catch( err => { console.log(JSON.stringify(err))})
        }).catch( err => console.log(JSON.stringify(err)) )
      }).catch( err => console.log(JSON.stringify(err)))
    var UsuarioId = this.global.ClaseRechazada.user.UsuarioId
    this.global.ClaseRechazada = { user : this.global.CurrentUser, rechazar : false}
    this.Notificar(UsuarioId)
      
  }

  Notificar(UsuarioId : string){
    this.notificaciones.getTokenUser(UsuarioId).then( data  =>{
      let token = data[0].FCM_Token
      this.notificaciones.sendNotification(token, this.global.ClaseRechazada ,{ titulo : "" , cuerpo : ""})
      .then(() => console.log("Notificacion Enviada"))
      .catch(err => console.error(JSON.stringify(err)))
      })
  }

}
