import { CardModel } from './../models/Card';
import { RedesLoginPage } from '../pages/redes-login/redes-login';
import { MateriasProfesorPage } from './../pages/materias-profesor/materias-profesor';
import { HttpModule } from '@angular/http';
import { CountryValidator } from './../validators/country.validator';
import { MenuPage } from './../pages/menu/menu';
import { formaPago } from './../models/FormaPago';
import { Factura } from './../models/Factura';
import { Usuario } from './../models/Usuario';
import { DashboardEstudiantePage } from './../pages/dashboard-estudiante/dashboard-estudiante';
import { RetirosPage } from './../pages/retiros/retiros';
import { SolicitarClaseMapaPage } from './../pages/solicitar-clase-mapa/solicitar-clase-mapa';
import { SolicitarClasePage } from './../pages/solicitar-clase/solicitar-clase';
import { RegistroPage } from './../pages/registro/registro';
import { PagosConfigPage } from './../pages/pagos-config/pagos-config';
import { LoginPage } from './../pages/login/login';
import { HelpPage } from './../pages/help/help';
import { DashboardPage } from './../pages/dashboard/dashboard';
import { ContactUsPage } from './../pages/contact-us/contact-us';
import { ClasesListPage } from './../pages/clases-list/clases-list';
import { ClasesDetailPage } from '../pages/clases-detail/clases-detail'
import { ProfilePage } from './../pages/profile/profile';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Clase } from '../models/Clase';
import { GlobalVariablesProvider } from '../providers/global-variables/global-variables';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidatorsModule } from '../validators/validators.module';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { IonTagsInputModule } from "ionic-tags-input";
import { MateriasServiceProvider } from '../providers/materias-service/materias-service';
import { EmailProvider } from '../providers/email-service/email-service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageResizer } from '@ionic-native/image-resizer';
import { EmailValidator } from '../validators/email.validator';
import { UpdatePasswordPage } from '../pages/update-password/update-password';
import { ClasesServiceProvider } from '../providers/clases-service/clases-service';
import { SanitizeProvider } from '../providers/sanitize/sanitize';
import { Ionic2RatingModule } from 'ionic2-rating';
import { FacturasServiceProvider } from '../providers/facturas-service/facturas-service';
import { SecureStorage } from '@ionic-native/secure-storage';
import { CardModule } from 'ngx-card/ngx-card';
import { MateriasEstudiantePage } from '../pages/materias-estudiante/materias-estudiante';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from "@ionic-native/google-maps";
import { MapServiceProvider } from '../providers/map-service/map-service';
import { SolicitarClaseProvider } from '../providers/solicitar-clase/solicitar-clase';
import { FCM } from '@ionic-native/fcm';
import { NotificationsProvider } from '../providers/notifications/notifications';
import { SolicitudClasePage } from '../pages/solicitud-clase/solicitud-clase';
import { CandidatoClasePage } from '../pages/candidato-clase/candidato-clase';
import { SearchingPage } from '../pages/searching/searching'; 
import { ComponentsModule } from '../components/components.module';
import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';
import { BackgroundMode } from '@ionic-native/background-mode';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ClasesDetailPage,
    ClasesListPage,
    ContactUsPage,
    DashboardPage,
    HelpPage,
    LoginPage,
    PagosConfigPage,
    RegistroPage,
    SolicitarClasePage,
    SolicitarClaseMapaPage,
    RetirosPage,
    DashboardEstudiantePage,
    MenuPage,
    CountryValidator,
    MateriasProfesorPage,
    RedesLoginPage,
    UpdatePasswordPage,
    ProfilePage,
    SanitizeProvider,
    MateriasEstudiantePage,
    SolicitudClasePage,
    CandidatoClasePage,
    SearchingPage,
  ],
  imports: [ 
    BrowserModule,  
    IonicModule.forRoot(MyApp),
    ReactiveFormsModule,
    ValidatorsModule,
    HttpModule,
    IonTagsInputModule,
    Ionic2RatingModule,
    CardModule,
    ComponentsModule,
  ],
  exports: [
    SanitizeProvider
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ClasesDetailPage,
    ClasesListPage,
    ContactUsPage,
    DashboardPage,
    HelpPage,
    LoginPage,
    PagosConfigPage,
    RegistroPage,
    SolicitarClasePage,
    SolicitarClaseMapaPage,
    RetirosPage,
    DashboardEstudiantePage,
    MenuPage,
    MateriasProfesorPage,
    RedesLoginPage,
    UpdatePasswordPage,
    ProfilePage,
    MateriasEstudiantePage,
    SolicitudClasePage,
    CandidatoClasePage,
    SearchingPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Usuario,
    Factura,
    Clase,
    CardModel,
    formaPago,
    GlobalVariablesProvider,
    UserServiceProvider,
    Facebook,
    GooglePlus,
    MateriasServiceProvider,
    EmailProvider,
    FileTransfer,
    FileTransferObject,
    File,
    ImagePicker,
    ImageResizer,
    EmailValidator,
    ClasesServiceProvider,
    FacturasServiceProvider,
    SecureStorage,
    Geolocation,
    GoogleMaps,
    MapServiceProvider,
    SolicitarClaseProvider,
    FCM,
    NotificationsProvider,
    LocationTrackerProvider,
    BackgroundMode,
  ]
})
export class AppModule {}
