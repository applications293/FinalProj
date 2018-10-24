import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the JobspopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'jobspopover',
  templateUrl: 'jobspopover.html'
})
export class JobspopoverComponent {

  items : any;

  constructor(private viewCtrl: ViewController) {
    this.items = [
      {name:'Freelancer'},
      {name:'Plumber'},
      {name:'Gardner boy'},
      {name:'Technical support assistance'},
      {name:'DataBase Administrator'},
      {name:'Accountant'},
      {name:'Clark'},
      {name: 'Other'},
      {name: 'All Jobs'}
    ];
  }
  
  itemClick(item){
    this.viewCtrl.dismiss(item);
  }


}
