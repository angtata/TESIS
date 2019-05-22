import { CardModel } from './../../models/Card';
import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { CardModule } from 'ngx-card/ngx-card';

@Component({
  selector: 'page-pagos-config',
  templateUrl: 'pagos-config.html',
})
export class PagosConfigPage {

  payments = [];
  addPaymentVar : boolean = false;
  card = new CardModel;
  delete = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private secureStorage: SecureStorage, public platform: Platform) {
    this.secureStorage.create('sotargePayments').then((storage: SecureStorageObject) =>{
      storage.get('payment')
      .then(data => { 
        this.payments = JSON.parse(data);
      })
      .catch(err => console.error(JSON.stringify(err)))
    })

    this.platform.registerBackButtonAction(()=>{
      if(this.addPaymentVar){
        this.addPaymentVar = false;
      }else{
        if(this.delete){
          this.delete = false;
        }else{
          this.navCtrl.pop();
        }
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PagosConfigPage');
  }

  selectPayment(payment){
    if(this.delete){
      for( var i = 0; i < this.payments.length; i++){ 
        if ( this.payments[i] == payment) {
          this.payments.splice(i, 1); 
        }
     }
    }else{
      this.payments.forEach( element => {
        if(element == payment){
          element.selected = true;
        }else{
          element.selected = false;
        }
      })
    }
    this.saveChanges();
  }

  changePay(){
    this.delete = true;
  }

  addPayment(){
    this.addPaymentVar = true;
    this.card = new CardModel;
  }

  addCard(){
    this.payments.push(this.card)    
    this.saveChanges();
  }

  isComplete(){
    if( this.card.number == null || this.card.number.toString() == "" 
    || this.card.name == null || this.card.name == "" 
    || this.card.expiration == null || this.card.expiration == "" 
    || this.card.cvc == null || this.card.cvc.toString() == "" ){
      return false;
    }else{
      return true;
    }
  }

  saveChanges(){
    if(this.payments.length == 1){
      this.payments[0].selected =  true; 
    }
    this.secureStorage.create('sotargePayments').then((storage: SecureStorageObject) =>{
      storage.set('payment', JSON.stringify(this.payments))
        .then(data => {console.log("storage!!"); this.addPaymentVar = false;})
        .catch(err => { console.error(JSON.stringify(err)); console.log("Awww :(")})
    })
  }

}
