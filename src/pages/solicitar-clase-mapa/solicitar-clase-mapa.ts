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
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0
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
      zoom: 15
    });

    
  
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      let marker = new google.maps.Marker({
        position: myLatLng,
        map: this.map
      });
      mapEle.classList.add('show-map');
    });
  }


}
