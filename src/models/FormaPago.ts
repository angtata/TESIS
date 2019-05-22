import { Injectable } from '@angular/core';

@Injectable()
export class formaPago {
    
    constructor(public id : string, public descripcion : string, public digitos : string, public tipo :string){
    }
}