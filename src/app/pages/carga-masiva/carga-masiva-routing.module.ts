import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CargaMasivaComponent } from './carga-masiva/carga-masiva.component';

const routes: Routes = [
  { path: 'carga-masiva',component:CargaMasivaComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargaMasivaRoutingModule { }
