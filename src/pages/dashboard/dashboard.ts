import { SanitizeProvider } from './../../providers/sanitize/sanitize';
import { UserServiceProvider } from './../../providers/user-service/user-service';
import { GlobalVariablesProvider } from './../../providers/global-variables/global-variables';
import { ClasesDetailPage } from './../clases-detail/clases-detail';
import { ClasesListPage } from './../clases-list/clases-list';
import { Component, ViewChild, Pipe } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { ClasesServiceProvider } from '../../providers/clases-service/clases-service';
import { Clase } from '../../models/Clase';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})

export class DashboardPage {

  @ViewChild('barHoras') barHoras;

  estado : boolean = true;
  GraficoHoras: any;
  lastclases : Clase[];

  constructor(private alertCtrl: AlertController, private locationTracker : LocationTrackerProvider, public navCtrl: NavController, public navParams: NavParams, public global : GlobalVariablesProvider, public clasesService : ClasesServiceProvider, public userService : UserServiceProvider) {
    this.lastclases = global.Clases.slice(0,3);
    this.UpdateEstado(true);
  }

  ionViewDidLoad() {  
    this.PutData()
  }

  PutData(){
    var lastMonth = new Date(new Date(Date.now()).setMonth(new Date(Date.now()).getMonth() - 1));
    var lastWeek = new Date(new Date(Date.now()).setDate(new Date(Date.now()).getDay() - 7));
    var lastlastWeek = new Date(new Date(Date.now()).setDate(new Date(Date.now()).getDay() - 14));
    var mes = this.global.Clases.filter( item => new Date(item.FechaHora) > lastMonth);
    var semena = this.global.Clases.filter( item => new Date(item.FechaHora) > lastWeek);
    var semenaPasada = this.global.Clases.filter( item => new Date(item.FechaHora) > lastlastWeek && new Date(item.FechaHora) < lastWeek );
      this.GraficoHoras = new Chart(this.barHoras.nativeElement, {
        type: 'horizontalBar',
        data: {
            labels: ["Este mes", "Esta Semana", "La semana Pasada"],
            datasets: [{
                label: 'Horas',
                data: [mes.length, semena.length, semenaPasada.length],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
      });
  }

  openPageClasesList() {
    this.navCtrl.push(ClasesListPage);
  }

  UpdateEstado(value){
    var data = {
      UsuarioId : this.global.CurrentUser.UsuarioId,
      estado : value ? 1 : 0
    }
    this.userService.updateActivoClase(data).then(() => console.log("Estado Actualizado")).catch( err => console.error(JSON.stringify(err)))
    if(value){
      this.locationTracker.startTracking(this.global.CurrentUser.UsuarioId);
    }else{
      this.errorAlert();
    }
  }

  calificarClase(clase : any){
    this.navCtrl.push(ClasesDetailPage,{ item: clase, calificar : true });
  }

  errorAlert() {
    let alert = this.alertCtrl.create({
      title: 'Hey!',
      subTitle: '¿Estas seguro que no quieres recibir ninguna solicitud de clase?',
      buttons: [{
        text : 'Si estoy seguro',
        handler : () => this.locationTracker.stopTracking(),
      },{
        text : 'No, mejor no',
        handler : () => {
          this.estado = true; 
          this.UpdateEstado(true)},
      }]
    });
    alert.present();
  }
}

