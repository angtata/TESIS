import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ClasesListPage } from '../clases-list/clases-list';
import { Chart } from 'chart.js';
import { GlobalVariablesProvider } from '../../providers/global-variables/global-variables';
import { Clase } from '../../models/Clase';
import { ClasesDetailPage } from '../clases-detail/clases-detail';
import { MateriasEstudiantePage } from '../materias-estudiante/materias-estudiante';

@Component({
  selector: 'page-dashboard-estudiante',
  templateUrl: 'dashboard-estudiante.html',
})
export class DashboardEstudiantePage {
  
  @ViewChild('barHoras') barHoras;
  GraficoHoras: any;
  lastclases : Clase[];

  
  constructor(public navCtrl: NavController, public navParams: NavParams, public globalV : GlobalVariablesProvider) {
    this.lastclases = globalV.Clases.slice(0,3);
  }

  ionViewDidLoad() {
    this.PutData();
  }

  PutData(){
    var lastMonth = new Date(new Date(Date.now()).setMonth(new Date(Date.now()).getMonth() - 1));
    var lastWeek = new Date(new Date(Date.now()).setDate(new Date(Date.now()).getDay() - 7));
    var lastlastWeek = new Date(new Date(Date.now()).setDate(new Date(Date.now()).getDay() - 14));
    var mes = this.globalV.Clases.filter( item => new Date(item.FechaHora) > lastMonth);
    var semena = this.globalV.Clases.filter( item => new Date(item.FechaHora) > lastWeek);
    var semenaPasada = this.globalV.Clases.filter( item => new Date(item.FechaHora) > lastlastWeek && new Date(item.FechaHora) < lastWeek );
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

  calificarClase(clase : any){
    this.navCtrl.push(ClasesDetailPage,{ item: clase, calificar : true });
  }

  SolicitarClase(){
    this.navCtrl.push(MateriasEstudiantePage, { item:false });
    console.log("Solicitar")
  }

}
