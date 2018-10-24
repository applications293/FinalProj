import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the HomePopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'home-popover',
  templateUrl: 'home-popover.html'
})
export class HomePopoverComponent {
  items : any;

  constructor(private viewCtrl: ViewController) {
    this.items = [
      {name:'Seminars and Conferences'},
      {name:'Trade Shows'},
      {name:'Executive Retreats and Incentive Programs'},
      {name:' Appreciation Events'},
      {name:'Sport Events'},
      {name:'Product Launch Events'},
      {name:'Entertainment Events'},
      {name: 'Other'}
    ];
  }

  itemClick(item){
    this.viewCtrl.dismiss(item);
  }

}
