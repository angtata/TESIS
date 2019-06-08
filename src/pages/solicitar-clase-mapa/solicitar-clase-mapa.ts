import { SearchingPage } from './../searching/searching';
import { MapServiceProvider } from './../../providers/map-service/map-service';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions
} from '@ionic-native/google-maps';
import { Observable } from 'rxjs/Observable';
import { GlobalVariablesProvider } from '../../providers/global-variables/global-variables';
import { SolicitarClaseProvider } from '../../providers/solicitar-clase/solicitar-clase';

declare var google;

@Component({
  selector: 'page-solicitar-clase-mapa',
  templateUrl: 'solicitar-clase-mapa.html',
})

export class SolicitarClaseMapaPage {

  map: GoogleMap;
  @ViewChild('searchbar', { read: ElementRef }) searchbar: ElementRef;
  addressElement: HTMLInputElement = null;
  address: any;
  StudentPos : any 

  constructor(public solicitarClaseService : SolicitarClaseProvider, public navCtrl: NavController, public navParams: NavParams, private mapService : MapServiceProvider, public global : GlobalVariablesProvider, public modalCtrl: ModalController) {
  }

  ngAfterViewInit() {
    this.loadMap();
    this.initAutocomplete();
  }

  loadMap(){
    let element: HTMLElement = document.getElementById('map_canvas');
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 3.359889, // default location
          lng: -76.638565 // default location
        },
        zoom: 17,
        tilt: 30
      }
    };

    this.map = GoogleMaps.create(element, mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
    .then(() => {
      // Now you can use all methods safely.
      this.getPosition();
    })
    .catch(error =>{
      console.log(JSON.stringify(error));
    });

    this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(
      (data) => {
        this.map.clear();
        this.StudentPos = data[0]
        this.setMarker(this.StudentPos)
      }
    );
  }

  setMarker(position){
    this.map.animateCamera({
      target: position,
      duration: 1000,
    });  
    this.map.addMarker({
      title: 'Prueba',
      icon: {
        url: "assets/imgs/Pin.png",
        size: {
            width: 60,
            height: 60
        }
      },
      animation: 'BOUNCE',
      position: position
    });
  }

  getPosition(): void{
    this.map.getMyLocation()
    .then(response => {
      this.StudentPos = response.latLng
      this.setMarker(this.StudentPos)
    })
    .catch(error =>{
      console.log(JSON.stringify(error));
    });
  }

  initAutocomplete(): void {
    this.addressElement = this.searchbar.nativeElement.querySelector('.searchbar-input');
    this.createAutocomplete(this.addressElement).subscribe((location) => {
      console.log('Searchdata', location);
      let latLngObj = {'lat': location.lat(), 'lng': location.lng()};
      this.getAddress(latLngObj);
      this.StudentPos = latLngObj
      this.map.clear();
      this.setMarker(this.StudentPos)
    });
  }

  createAutocomplete(addressEl: HTMLInputElement): Observable<any> {
    const autocomplete = new google.maps.places.Autocomplete(addressEl);
    autocomplete.bindTo('bounds', this.map);
    return new Observable((sub: any) => {
      google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          sub.error({
            message: 'Autocomplete returned place with no geometry'
          });
        } else {
          let latLngObj = {'lat': place.geometry.location.lat(), 'long': place.geometry.location.lng()}
          this.getAddress(latLngObj);
          sub.next(place.geometry.location);
        }
      });
    });
  }

  getAddressComponentByPlace(place, latLngObj) {
    var components;
    components = {};
    for(var i = 0; i < place.address_components.length; i++){
      let ac = place.address_components[i];
      components[ac.types[0]] = ac.long_name;
    }
    let addressObj = {
      street: (components.street_number) ? components.street_number : 'not found',
      area: components.route,
      city: (components.sublocality_level_1) ? components.sublocality_level_1 : components.locality,
      country: (components.administrative_area_level_1) ? components.administrative_area_level_1 : components.political,
      postCode: components.postal_code,
      loc: [latLngObj.long, latLngObj.lat],
      address: this.address
    }
    localStorage.clear();
    localStorage.setItem('carryr_customer', JSON.stringify(addressObj));
    return components;
  }

  getAddress(latLngObj) {
    // Get the address object based on latLngObj
    this.mapService.getStreetAddress(latLngObj).subscribe(
      s_address => {
        if (s_address.status == "ZERO_RESULTS") {
          this.mapService.getAddress(latLngObj).subscribe(
            address => {
              this.address = address.results[0].formatted_address;
              this.getAddressComponentByPlace(address.results[0], latLngObj);
            },
            err => console.log("Error in getting the street address " + err)
          )
        } else {
          this.address = s_address.results[0].formatted_address;
          this.getAddressComponentByPlace(s_address.results[0], latLngObj);
          console.log(this.address);
        }
      },
      err => {
        console.log('No Address found ' + err);
      }
    );
  }

  Solicitar(){
    this.global.TempClase.user = this.global.CurrentUser;
    this.global.TempClase.ubicacion = this.StudentPos;
    this.global.TempClase.direccion = this.address;
    this.global.ClaseRechazada.rechazar = null;
    let profileModal = this.modalCtrl.create(SearchingPage, {}, { cssClass: 'select-modal4' });
    profileModal.present();
    this.solicitarClaseService.SolicitarClaseP(this.global.TempClase);
  }

}
