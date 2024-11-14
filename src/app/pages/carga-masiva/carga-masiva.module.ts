import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CargaMasivaRoutingModule } from './carga-masiva-routing.module';
import { CargaMasivaComponent } from './carga-masiva/carga-masiva.component';
import { DxButtonModule, DxFileUploaderModule } from 'devextreme-angular';


@NgModule({
  declarations: [CargaMasivaComponent],
  imports: [
    CommonModule,
    CargaMasivaRoutingModule,
    DxButtonModule,
    DxFileUploaderModule
  ]
})
export class CargaMasivaModule { }
