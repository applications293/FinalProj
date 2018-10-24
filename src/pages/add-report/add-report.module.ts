import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddReportPage } from './add-report';

@NgModule({
  declarations: [
    AddReportPage,
  ],
  imports: [
    IonicPageModule.forChild(AddReportPage),
  ],
})
export class AddReportPageModule {}
