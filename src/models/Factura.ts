import { Injectable } from '@angular/core';

@Injectable()
export class Factura {
    constructor( public numFactura : string, public valorBruto : string, public ValorTiempo : string, public ValorIva : string, public ValorPasarela : string, public ValorTotal : string){
    }
}