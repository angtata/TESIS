import { UserServiceProvider } from './../user-service/user-service';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';

@Injectable()
export class LocationTrackerProvider {

  private star : boolean = false;

  constructor(private backgroundMode: BackgroundMode, private geolocation: Geolocation, private userservice : UserServiceProvider) {
    console.log('Hello LocationTrackerProvider Provider');
  }

  startTracking(UsuarioId : string) {
    this.getPosition(UsuarioId);
    this.star = true;
    this.backgroundMode.on('activate').subscribe(() => {
      console.log('activated');
      setInterval(() => {
        if (this.star)
          this.getPosition(UsuarioId);
        else
          clearInterval(0);
      }, 300000);
    });
    this.backgroundMode.enable();
  }

  getPosition(Usuario : string){
    let options = { timeout: 30000 };
    this.geolocation.getCurrentPosition(options).then(response => {
      console.log(JSON.stringify(response));
      this.userservice.updatePos({Longitud : response.coords.longitude, Latitud : response.coords.latitude, UsuarioId : Usuario })
      .then(() => console.log("ubicación actualizada"))
      .catch(error =>{console.error(JSON.stringify(error))})
    }).catch(error =>{console.error(JSON.stringify(error))})
  }

  stopTracking() {
    this.star = false;
    console.log('stopTracking');
  }


}
