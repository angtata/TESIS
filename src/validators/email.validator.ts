import { FormGroup, FormControl } from "@angular/forms";
import { UserServiceProvider } from '../providers/user-service/user-service';
import { Injectable } from "@angular/core";

@Injectable()
export class EmailValidator {

    constructor(public userService: UserServiceProvider){

    }

    checkEmail( control : FormControl): any {
        return new Promise( resolve => {
            this.userService.getUserByEmail(control.value).then( data => {
                if(data[0] == undefined){
                    resolve(null)
                }else{
                    resolve({"username taken": true})
                }
            })
        })
    }
  }