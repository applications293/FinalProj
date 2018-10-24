import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the FeedComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'feed',
  templateUrl: 'feed.html'
})
export class FeedComponent {

  show: Array<{ title: string, component: any }>;

  constructor(private viewCtrl: ViewController) {
    console.log('Hello FeedComponent Component');
 
    this.show = [
      { title: 'Register', component: 'RegisterPage' },
      { title: 'Login', component: 'LoginPage' }
    ];
  }

  itemClick(show){
    this.viewCtrl.dismiss(show);
  }

}
