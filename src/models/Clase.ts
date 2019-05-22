import { Usuario } from './Usuario';
import { Injectable } from '@angular/core';

@Injectable()
export class Clase {

    public ClaseId : string;
    public Profesor : Usuario;
    public Estudiante : Usuario;
    public MateriaId : number;
    public FacturaId : string;
    public TipoClase : number;
    public FechaHora: string;
    public Direccion : string;
    public Latitud : number;
    public Longitud : number;
    public CalificacionEstudiante  : number;
    public CalificacionProfesor : number;

    constructor();
    constructor(
        ClaseId ? : string,
        Profesor ? : Usuario, 
        Estudiante ? : Usuario, 
        MateriaId ? : number,
        FacturaId ? : string,
        TipoClase ? : number,
        FechaHora ? : string, 
        Direccion ? : string, 
        Latitud ? : number,
        Longitud ? : number,
        CalificacionEstudiante ? : number,
        CalificacionProfesor ? : number 
        ){

            this.ClaseId = ClaseId;
            this.Profesor = Profesor;
            this.Estudiante = Estudiante;
            this.MateriaId = MateriaId;
            this.FacturaId = FacturaId;
            this.TipoClase = TipoClase;
            this.FechaHora = FechaHora;
            this.Direccion = Direccion;
            this.Latitud = Latitud;
            this.Longitud = Longitud;
            this.CalificacionEstudiante = CalificacionEstudiante;
            this.CalificacionProfesor = CalificacionProfesor;

    }
}