import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalVariablesProvider } from '../../providers/global-variables/global-variables';

@Component({
  selector: 'page-match',
  templateUrl: 'match.html',
})

export class MatchPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public global : GlobalVariablesProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchPage');
  }

}
