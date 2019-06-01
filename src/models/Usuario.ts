import { Injectable } from '@angular/core';

@Injectable()
export class Usuario {
    
    public UsuarioId: string;
    public NombreCompleto: string;
    public Correo: string;
    public Telefono: string;
    public TipoUsuario: number;
    public FacebookId: string;
    public GoogleId: string;
    public Imagen: string;
    public Longitud: number;
    public Latitud: number;
    public Calificacion: number;
    public DescripcionTipo: string;
    public EstadoNombre: string;
    public Contrasena: string;
    public Escolaridad: string

    constructor();
    constructor(
         UsuarioId ?:string,
         NombreCompleto?: string, 
         Correo?:string, 
         Telefono?: string,
         TipoUsuario?: number,
         FacebookId ? :string, 
         GoogleId ?: string, 
         Imagen ?: string, 
         Longitud ? : number, 
         Latitud ?: number, 
         Calificacion ?: number, 
         DescripcionTipo ?: string,
         EstadoNombre ?: string,
         Contrasena ?: string,
         Escolaridad ?: string
        ){
            
            this.UsuarioId = UsuarioId
            this.NombreCompleto = NombreCompleto
            this.Correo = Correo
            this.Telefono = Telefono
            this.TipoUsuario = TipoUsuario
            this.FacebookId = FacebookId
            this.GoogleId = GoogleId
            this.Imagen = Imagen
            this.Longitud = Longitud
            this.Latitud = Latitud
            this.Calificacion = Calificacion
            this.DescripcionTipo = DescripcionTipo
            this.EstadoNombre = EstadoNombre
            this.Contrasena = Contrasena
            this.Escolaridad = Escolaridad
    }
}