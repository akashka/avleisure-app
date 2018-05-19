import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItineriesPage } from './itineries';

@NgModule({
  declarations: [
    ItineriesPage,
  ],
  imports: [
    IonicPageModule.forChild(ItineriesPage),
  ],
})
export class ItineriesPageModule {}
