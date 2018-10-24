import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the ViewReportsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'view-reports',
  templateUrl: 'view-reports.html'
})
export class ViewReportsComponent {

  items : any;

  constructor(private viewCtrl: ViewController) {
    this.items = [
      {name:'Freelancer'},
      {name:'Plumber'},
      {name:'Gardner boy'},
      {name:'Technical support assistance'},
      {name:'DataBase Administrator'},
      {name:'Accountant'},
      {name:'Clark'}
    ];
  }
  
  itemClick(item){
    this.viewCtrl.dismiss(item);
  }
}
