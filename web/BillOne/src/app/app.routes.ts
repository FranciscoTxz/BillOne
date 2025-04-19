import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AvisoPrivacidadComponent } from './pages/aviso-privacidad/aviso-privacidad.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { GfaComponent } from './pages/gfa/gfa.component';
import { MenuProcesoComponent } from './pages/inicio/components/menu-proceso/menu-proceso.component';
import { DatosServicioComponent } from './pages/inicio/components/datos-servicio/datos-servicio.component';
import { RecuperarCfdiComponent } from './pages/inicio/components/recuperar-cfdi/recuperar-cfdi.component';

export const routes: Routes = [
    { path: '', component: InicioComponent},
    { path: 'aviso-privacidad', component: AvisoPrivacidadComponent},
    { path: 'faq', component: FaqComponent},
    { path: 'contacto', component: ContactoComponent},
    { path: 'gfa', component: GfaComponent},
    { path: 'facturar', component: MenuProcesoComponent},
    { path: 'recuperar-cfdi', component: RecuperarCfdiComponent},
    { path: '**', redirectTo: ''} // Redirige cualquier ruta no encontrada a la página de inicio
];
