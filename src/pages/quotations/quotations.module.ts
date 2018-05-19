import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuotationsPage } from './quotations';

@NgModule({
  declarations: [
    QuotationsPage,
  ],
  imports: [
    IonicPageModule.forChild(QuotationsPage),
  ],
})
export class QuotationsPageModule {}
