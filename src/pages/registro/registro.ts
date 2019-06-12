import { HomePage } from './../home/home';
import { Usuario } from './../../models/Usuario';
import { GlobalVariablesProvider } from './../../providers/global-variables/global-variables';
import { Component } from '@angular/core';
import { NavController, NavParams, Platform, App, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Country } from './registro.model';
import emailMask from 'text-mask-addons/dist/emailMask';
import { PasswordValidator } from '../../validators/password.validator';
import { PhoneValidator } from '../../validators/phone.validator';
import { MateriasProfesorPage } from '../materias-profesor/materias-profesor';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { MenuPage } from '../menu/menu';
import { MateriasServiceProvider } from '../../providers/materias-service/materias-service';
import { EmailValidator } from '../../validators/email.validator';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';

@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {

  validations_form: FormGroup;
  matching_passwords_group: FormGroup;
  country_phone_group: FormGroup;
  select_type_user_group : FormGroup;
  emailMask = emailMask;
  countries: Array<Country>;
  materias: any[];
  isTeacher : boolean;
  user: any;
  encode : any;
  imageFileName:any;
  ImageSrc : string = "assets/imgs/User.png";
  validation_messages = {
    'email': [
      { type: 'required', message: 'Oye! Es obligatorio escribir un correo electrónico.' },
      { type: 'pattern', message: 'Ese no parece ser un correo válido' },
      { type: 'username taken', message: 'Uy! ese correo ya está en uso, prueba recuperar tu contraseña'}
    ],
    'phone': [
      { type: 'required', message: 'Oye! Es obligatorio escribir tu número de teléfono.' },
      { type: 'validCountryPhone', message: 'Uy! Ese no parece ser un número de teléfono.' }
    ],
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
  scholarshipList : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public global : GlobalVariablesProvider, public platform :  Platform, public userService :  UserServiceProvider, private appCtrl: App, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public materiasService : MateriasServiceProvider,  public emailValidator: EmailValidator, private secureStorage: SecureStorage) {
    platform.registerBackButtonAction(()=>{
      this.navCtrl.pop();
      this.global.SelectedMaterias = []
    })

    this.userService.getLevelUserList().then( data => {
      this.scholarshipList = data;
    });
    
    this.countries = [
      new Country('CO', 'Colombia')
    ];

    this.select_type_user_group = this.formBuilder.group({
        teacher : false,
        student : true
    });
    
    this.select_type_user_group.setErrors({required: true})
    this.select_type_user_group.valueChanges.subscribe((newValue) =>{
      this.isTeacher = newValue.teacher;
      if(newValue.teacher === true || newValue.student == true){
        this.select_type_user_group.setErrors(null)
      } else{
        this.select_type_user_group.setErrors({required: true})
      }
    })
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
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
      ]), emailValidator.checkEmail.bind(emailValidator) ),
      country_phone: this.country_phone_group,
      matching_passwords: this.matching_passwords_group,
      select_type_user: this.select_type_user_group,
      materias: [],
      scholarship : new FormControl(''), //Validators.compose([Validators.required])),
    });
  }

  ionViewDidEnter(){
    this.materias = [];
    if(this.global.SelectedMaterias != undefined){
      this.global.SelectedMaterias.forEach(element => {
        this.materias.push(element.Materia)  
      });
      this.validations_form.controls['materias'].setValue(this.materias)                          
    }
    console.log('RegistroPage')
  }

  onSubmit(values){
    var tipoUser = 0;
    if(values.select_type_user.teacher){
      if(values.select_type_user.student){
        if(values.scholarship > 4){
          tipoUser = 5; 
        }else{
          tipoUser = 4; 
        }    
      }else{
        if(values.scholarship > 4){
          tipoUser = 3; 
        }else{
          tipoUser = 2; 
        } 
      }
    }else{
      tipoUser = 1;
    }
    var data = {
      nombre : values.nombre, 
      psw : btoa(values.matching_passwords.password), 
      correo : values.email, 
      telefono : values.country_phone.phone,
      tipouser : tipoUser,
      imagen : this.ImageSrc,
      escolaridad : values.scholarship ? values.scholarship : 1 
    }
    this.userService.createUser(data).then( () => {
      this.userService.getUserByEmail(values.email).then( user => {
        this.user = user[0];
        this.global.CurrentUser = <Usuario>this.user;
        this.secureStorage.create('login').then((storage: SecureStorageObject) =>{
          storage.set('user', JSON.stringify(this.global.CurrentUser))
            .then(() => {console.log("storage!!");})
            .catch(err => { console.error(JSON.stringify(err)); console.log("Awww :(")})
        })
        this.global.TipoIngeso = this.global.CurrentUser.TipoUsuario == 1 ? true : false;
        this.navCtrl.pop();
        if (!this.global.TipoIngeso){
          this.materiasService.deleteMateriasUser(this.global.CurrentUser.UsuarioId).then(()=>{
            this.global.SelectedMaterias.forEach(element => {
              let data = { MateriaId : element.MateriaId, UsuarioId : this.global.CurrentUser.UsuarioId.toString() }
              this.materiasService.InsertMateriaUsuario(data).then(() => console.log("Materia Asociada")).catch( err=> console.error(err))
            });
          }).catch(err => console.error(JSON.stringify(err)))
        }
        if (this.global.CurrentUser.TipoUsuario == 4){
          let profileModal = this.modalCtrl.create(HomePage, {}, {cssClass: 'select-modal' });
          profileModal.present();
        } 
        else {
          this.appCtrl.getRootNavs()[0].setRoot(MenuPage);
        }
      }).catch( err => console.error(JSON.stringify(err)))
    }).catch( err => console.error(JSON.stringify(err)))
  }

  AddMateria(){
    var email = this.validations_form.value['email']
    var number = this.validations_form.value['country_phone']
    var name = this.validations_form.value['nombre']
    this.global.TempUser.Email = email;
    this.global.TempUser.Phone = number.phone;
    this.global.TempUser.Name = name;
    this.navCtrl.push(MateriasProfesorPage, { item:false });
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

  SubirImagen(){
    this.global.AddImage()
    .then(filePath => {
      let loader = this.loadingCtrl.create({ content: "Subiendo Imágen"});
      loader.present();
      this.global.uploadFile( filePath.toString() , this.validations_form.value['email'])
      .then( () => { 
        loader.dismiss(); 
        this.presentToast("Imagen cargada correctamente");
        this.global.downloadFile(this.validations_form.value['email'])
        .then( url => { 
          this.ImageSrc = String(url) + '?' + this.random();
        })
        .catch( err => console.log(err))})
      .catch( err => {
        console.log(JSON.stringify(err));
        loader.dismiss(); 
        this.presentToast("Se ha presentado un problema al subir la imagen");
      });
    }).catch(err => console.log(err))
  }

  random(): number {
    let rand = Math.floor(Math.random()*20000000)+1000000;
    return rand;       
  }

}
