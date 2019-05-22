import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';

declare var google;

@Component({
  selector: 'page-solicitar-clase-mapa',
  templateUrl: 'solicitar-clase-mapa.html',
})

export class SolicitarClaseMapaPage {

  map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation, private platform: Platform) {
  }

  ionViewDidLoad() {
    this.getPosition();
    console.log('ionViewDidLoad SolicitarClaseMapaPage');
  }
  
  getPosition():any{
    let options = {
      timeout: 30000
    };
    this.geolocation.getCurrentPosition(options).then(response => {
      this.loadMap(response);
    })
    .catch(error =>{
      console.error(JSON.stringify(error));
    })
  }

  loadMap(position: Geoposition){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    console.log(latitude, longitude);
    
    // create a new map by passing HTMLElement
    let mapEle: HTMLElement = document.getElementById('map');

    // create LatLng object
    let myLatLng = {lat: latitude, lng: longitude};

    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 17
    });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      let marker = new google.maps.Marker({
        position: myLatLng,
        map: this.map,
        title: 'Hello World!'
      });
      mapEle.classList.add('show-map');
    });
  }

  search(value: any){
    console.log(value)
  }

}
