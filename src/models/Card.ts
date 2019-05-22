import { Injectable } from '@angular/core';

@Injectable()
export class CardModel {
    constructor(
        public number ?: number,
        public name ?: string,
        public expiration ?: string,
        public cvc ?: number,
        public selected ?: boolean
        ){
    }
}