import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, App } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { PasswordValidator } from '../../validators/password.validator';
import { UserServiceProvider } from '../../providers/user-service/user-service';

@Component({
  selector: 'page-update-password',
  templateUrl: 'update-password.html',
})
export class UpdatePasswordPage {
  
  matching_passwords_group: FormGroup;
  validations_form: FormGroup;
  validation_messages = {
    'password': [
      { type: 'required', message: 'Oye! Es obligatorio escribir una contraseña.' },
      { type: 'minlength', message: 'Tu contraseña debe tener al menos 5 caracteres.' },
      { type: 'pattern', message: 'Tu contraseña debe tener al menos una letra mayúscula, una letra minúscula y un número.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Oye! Es necesario confirmar tu contraseña.' }
    ],
    'matching_passwords': [
      { type: 'areEqual', message: 'Uy! Las contraseñas no son iguales.' }
    ]
  }
  email: any;
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public userService :  UserServiceProvider, public formBuilder: FormBuilder,private alertCtrl: AlertController, private appCtrl: App) {

    this.matching_passwords_group = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
      confirm_password: new FormControl('', Validators.required)
      }, (formGroup: FormGroup) => {
        return PasswordValidator.areEqual(formGroup);
    }); 

    this.validations_form = this.formBuilder.group({
      matching_passwords: this.matching_passwords_group
    });
    
  }

  ionViewDidEnter() {
    this.email = this.navParams.get('email');
    console.log('ionViewDidLoad UpdatePasswordPage');
  }

  onSubmit(values: { matching_passwords: { password: string; }; }){
    this.userService.getUserByEmail(this.email)
    .then( data => {
      let user = data[0]
      let dataSend = {
        userId : user.UsuarioId, 
        psw : btoa(values.matching_passwords.password)
      }
    this.userService.updatePsw(dataSend)
    .then(() => { this.appCtrl.navPop(); this.successAlert();})
    .catch(() => this.errorAlert())
    }).catch(() => this.errorAlert())
  }

  successAlert(){
    let alert = this.alertCtrl.create({
      title: '¡Perfecto!',
      subTitle: 'Contraseña actualizada exitosamente',
      buttons: ['Aceptar']
    });
    alert.present();
  }

  errorAlert() {
    let alert = this.alertCtrl.create({
      title: 'Ups!',
      subTitle: 'No hemos podido actualizar tus datos, por favor intenta nuevamente',
      buttons: ['Aceptar']
    });
    alert.present();
  }

}
