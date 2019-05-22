import { GlobalVariablesProvider } from './../../providers/global-variables/global-variables';
import { ClasesServiceProvider } from '../../providers/clases-service/clases-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { Clase } from './../../models/Clase';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController} from 'ionic-angular';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'page-clases-detail',
  templateUrl: 'clases-detail.html',
})
export class ClasesDetailPage {

  clase: Clase;
  factura: any;
  fecha : any;
  calificarClase : boolean;
  validations_form: FormGroup;
  validation_messages = {
    'raiting': [
      { type: 'required', message: 'Debes dar una calificación' }
    ],
    'mgs': [
      { type: 'required', message: 'Debes ingresar una descripción' }
    ]
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public global : GlobalVariablesProvider, public formBuilder: FormBuilder, public clasesService : ClasesServiceProvider, public userService :  UserServiceProvider, private alertCtrl: AlertController) {
    this.clase = navParams.get('item');
    this.calificarClase = navParams.get('calificar')
    var fecha = new Date(this.clase.FechaHora);
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour:'numeric', minute:'numeric'};
    this.fecha = fecha.toLocaleDateString("es-ES", options);

    this.validations_form = this.formBuilder.group({
      raiting :  new FormControl('', Validators.compose([Validators.required])),
      mgs : new FormControl('', Validators.compose([Validators.required]))
    });
  }

  ionViewDidLoad() {
  }

  calificar(){
    this.calificarClase = true;
  }

  onSubmit(value){
    let data = { 
      Calificacion : value.raiting, 
      ClaseId : this.clase.ClaseId, 
      Profesor : this.clase.Profesor.UsuarioId, 
      Estudiante : this.clase.Estudiante.UsuarioId,
      Texto	: value.mgs
    }
    if(this.global.TipoIngeso){
      this.clasesService.calificarTeacher(data).then( () => {
        this.clase.CalificacionProfesor = value.raiting;
        this.StudentAlert();
        this.calificarClase = false;
      }).catch(() => this.errorAlert());
    }else{
      this.clasesService.calificarStudent(data).then(()=>{
        this.clase.CalificacionEstudiante = value.raiting;
        this.TeacherAlert();
        this.calificarClase = false;
      }).catch(() => this.errorAlert());
    }
  }

  TeacherAlert() {
    let alert = this.alertCtrl.create({
      title: '¡Gracias!',
      subTitle: 'Gracias por calificar tu clase, de esta forma podremos agendarte con estudiantes de tu agrado',
      buttons: ['Aceptar']
    });
    alert.present();
  }

  StudentAlert() {
    let alert = this.alertCtrl.create({
      title: '¡Gracias!',
      subTitle: 'Gracias por calificar tu clase, de esta forma podremos agendarte con profesores de tu agrado',
      buttons: ['Aceptar']
    });
    alert.present();
  }

  errorAlert() {
    let alert = this.alertCtrl.create({
      title: 'Ups!',
      subTitle: 'Se ha presentado un problema, por favor intenta nuevamente',
      buttons: ['Aceptar']
    });
    alert.present();
  }
}
