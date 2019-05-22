import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { GlobalVariablesProvider } from '../../providers/global-variables/global-variables';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import emailMask from 'text-mask-addons/dist/emailMask';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { MateriasProfesorPage } from '../materias-profesor/materias-profesor';
import { Country } from '../registro/registro.model';
import { PhoneValidator } from '../../validators/phone.validator';
import { EmailValidator } from '../../validators/email.validator';
import { MateriasServiceProvider } from '../../providers/materias-service/materias-service';
import { Usuario } from '../../models/Usuario';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})

export class ProfilePage {

  validations_form: FormGroup;
  validation_messages = {
    'phone': [
      { type: 'required', message: 'Oye! Es obligatorio escribir tu número de teléfono.' },
      { type: 'validCountryPhone', message: 'Uy! Ese no parece ser un número de teléfono.' }
    ]
  }
  scholarshipList: {};
  countries: Array<Country> = [new Country('CO', 'Colombia')];
  country_phone_group: FormGroup;
  UserImage: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public global : GlobalVariablesProvider, public userService :  UserServiceProvider, public formBuilder: FormBuilder, public emailValidator: EmailValidator, public materiasService : MateriasServiceProvider, private alertCtrl: AlertController, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
    this.UserImage = this.global.CurrentUser.Imagen;
    this.userService.getLevelUserList().then( data => {
      this.scholarshipList = data;
    });

    let country = new FormControl(this.countries[0], Validators.required);
    let phone = new FormControl('', Validators.compose([
      Validators.required,
      PhoneValidator.validCountryPhone(country)
    ]));
    this.country_phone_group = new FormGroup({
      country: country,
      phone: phone
    });
    this.validations_form = this.formBuilder.group({
      nombre : new FormControl('', Validators.compose([Validators.required])),
      country_phone: this.country_phone_group,
      materias: [],
      scholarship : new FormControl('',Validators.compose([Validators.required])),
    });
  }

  ionViewDidEnter() {
    this.validations_form.controls['nombre'].setValue(this.global.CurrentUser.NombreCompleto);             
    this.country_phone_group.controls['phone'].setValue(this.global.CurrentUser.Telefono);
    this.validations_form.controls['scholarship'].setValue(this.global.CurrentUser.Escolaridad);
    this.materiasService.getMateriasUserList(this.global.CurrentUser.UsuarioId).then( data => {
      var materiasList = Object.keys(data).map(function(index){
        let materia = data[index];
        return materia;
      });

      this.global.SelectedMaterias = this.global.SelectedMaterias == null ?  materiasList : this.global.SelectedMaterias
      var materias = []
      this.global.SelectedMaterias.forEach( element => {
        materias.push(element['Materia'])
      })
      this.validations_form.controls['materias'].setValue(materias)                          
    })
    console.log('ionViewDidLoad ProfilePage');
  }

  onSubmit(values : any){
    var data = {
      UsuarioId : this.global.CurrentUser.UsuarioId,
      Nombre : values.nombre,
      Telefono : values.country_phone.phone,
      Escolaridad : values.scholarship
    }
    this.userService.updateUser(data).then(() => {
      this.userService.getUserByEmail(this.global.CurrentUser.Correo)
      .then(user => {
        this.global.CurrentUser = <Usuario>user[0]; 
        this.global.CurrentUser.Imagen = this.UserImage;
        this.successAlert(); })
      .catch(() => this.errorAlert())
    }).catch(() => this.errorAlert())
  }

  SubirImagen(){
    this.global.AddImage()
    .then(filePath => {
      let loader = this.loadingCtrl.create({ content: "Subiendo Imágen"});
      loader.present();
      this.global.uploadFile( filePath.toString() , this.global.CurrentUser.Correo)
      .then( () => { 
        loader.dismiss(); 
        this.presentToast("Imagen cargada correctamente");
        this.global.downloadFile(this.global.CurrentUser.Correo)
        .then( url => { 
          this.global.CurrentUser.Imagen = String(url) + '?' + this.random();
          this.UserImage = this.global.CurrentUser.Imagen;
        }).catch( err => {this.presentToast("Se ha presentado un problema al subir la imagen"); console.error(JSON.stringify(err))})
      }).catch( err => {
        console.error(JSON.stringify(err))
        loader.dismiss(); 
        this.presentToast("Se ha presentado un problema al subir la imagen");});
    }).catch(err => console.error(JSON.stringify(err)))
  }

  AddMateria(){
    var email = this.validations_form.value['email']
    var number = this.validations_form.value['country_phone']
    var name = this.validations_form.value['nombre']
    this.global.TempEmail = email;
    this.global.TempPhone = number.phone;
    this.global.TempName = name;
    this.navCtrl.push(MateriasProfesorPage, { item:false });
  }

  successAlert() {
    let alert = this.alertCtrl.create({
      title: '¡Perfecto!',
      subTitle: 'Tu información se ha actualizado correctamente',
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
  
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  random(): number {
    let rand = Math.floor(Math.random()*20000000)+1000000;
    return rand;       
  }

}
