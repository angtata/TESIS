import { Usuario } from './../../models/Usuario';
import { Injectable } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageResizerOptions, ImageResizer } from '@ionic-native/image-resizer';
import { FileTransferObject, FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer';
import { Configuracion } from '../../app/app.configuration';
import { File } from '@ionic-native/file';
import { Clase } from '../../models/Clase';

@Injectable()
export class GlobalVariablesProvider {
  

  public TipoIngeso : boolean;
  public CurrentUser : Usuario;
  public Clases : Clase[];
  public SelectedMaterias: any;
  public TempEmail : any;
  public TempPhone : any;
  public TempName : any;
  public ClaseRechazada  = { user : new Usuario(), rechazar : null};
  public TempClase = { materia: "", opciones: [], ubicacion: {}, direccion: "", hora: new Date(), user: new Usuario() }

  constructor( private imagePicker: ImagePicker, private imageResizer: ImageResizer, private transfer: FileTransfer, private file: File) {
    console.log('Hello GlobalVariablesProvider Provider');
  }

  AddImage(){
    return new Promise((resolve, reject) =>{
      let options = { maximumImagesCount:1 }
      this.imagePicker.getPictures(options)
      .then((results) => {
        for (var i = 0; i < results.length; i++) {
            var imageURI = results[i];
        }
        let options = {
          uri: imageURI,
          folderName: 'Protonet',
          quality: 100,
          width: 600,
          height: 600
         } as ImageResizerOptions;
         
        this.imageResizer
          .resize(options)
          .then((filePath: string) => { resolve(filePath) })
          .catch(err => {reject(err)});
      }).catch(err => {reject(err)});
    })  
  }

  uploadFile(file: string, name: string) {
    return new Promise( (resolve, reject) =>{
      const fileTransfer: FileTransferObject = this.transfer.create();
      var encode = btoa(name)
      let options: FileUploadOptions = {
        fileKey: encode,
        fileName: encode,
        chunkedMode: false,
        mimeType: 'multipart/form-data',
        httpMethod:'POST',
        headers: {}
      }
    
      fileTransfer.upload(file, `${Configuracion.URL}upload`, options)
        .then((data) => {resolve(data)})
        .catch(err => {reject(err)});
    })
  }

  downloadFile(imageFileName: string){
    return new Promise((resolve, reject) =>{
      var encode = btoa(imageFileName)
      let url = encodeURI(`${Configuracion.URL}download/${encode}`); 
      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer.download(url, this.file.externalDataDirectory + 'profile', true, {create: false} )
      .then((entry) => {resolve(entry.toInternalURL())})
      .catch(err => {reject(err)}) 
    })
    
  }
}
