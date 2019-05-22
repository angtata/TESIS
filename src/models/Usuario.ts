import { Injectable } from '@angular/core';

@Injectable()
export class Usuario {
    
    constructor(
        public UsuarioId:string,
        public NombreCompleto: string, 
        public Correo:string, 
        public Telefono: string,
        public TipoUsuario : number,
        public FacebookId ? :string, 
        public GoogleId ?: string, 
        public Imagen ?: string, 
        public Longitud ? : number, 
        public Latitud ?: number, 
        public Calificacion ?: number, 
        public DescripcionTipo ?: string,
        public EstadoNombre ?: string,
        public Contrasena ?: string,
        public Escolaridad ?: string){
    }
}