import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AvisoPrivacidadComponent } from './pages/aviso-privacidad/aviso-privacidad.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { GfaComponent } from './pages/gfa/gfa.component';

export const routes: Routes = [
    { path: '', component: InicioComponent},
    { path: 'aviso-privacidad', component: AvisoPrivacidadComponent},
    { path: 'faq', component: FaqComponent},
    { path: 'contacto', component: ContactoComponent},
    { path: 'gfa', component: GfaComponent},
    { path: '**', redirectTo: ''} // Redirige cualquier ruta no encontrada a la página de inicio
];
