import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubidaFotoPageRoutingModule } from './subida-foto-routing.module';

import { SubidaFotoPage } from './subida-foto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubidaFotoPageRoutingModule
  ],
  declarations: [SubidaFotoPage]
})
export class SubidaFotoPageModule {}
