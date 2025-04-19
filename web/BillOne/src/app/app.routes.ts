import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AvisoPrivacidadComponent } from './pages/aviso-privacidad/aviso-privacidad.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { MenuProcesoComponent } from './pages/inicio/components/menu-proceso/menu-proceso.component';
import { DatosServicioComponent } from './pages/inicio/components/datos-servicio/datos-servicio.component';

import { LoginAdminComponent } from './pages/admin/login-admin/login-admin.component';

import { RecuperarCfdiComponent } from './pages/inicio/components/recuperar-cfdi/recuperar-cfdi.component';

export const routes: Routes = [
    { path: '', component: InicioComponent},
    { path: 'aviso-privacidad', component: AvisoPrivacidadComponent},
    { path: 'faq', component: FaqComponent},
    { path: 'contacto', component: ContactoComponent},
    { path: 'facturar', component: MenuProcesoComponent},
    { path: 'login-admin', component: LoginAdminComponent}, // Ruta para el componente de inicio de sesión del administrador
    { path: 'recuperar-cfdi', component: RecuperarCfdiComponent},
    { path: '**', redirectTo: ''} // Redirige cualquier ruta no encontrada a la página de inicio
];
