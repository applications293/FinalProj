import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MakhePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-makhe',
  templateUrl: 'makhe.html',
})
export class MakhePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MakhePage');
  }


  
  SignIn(){


    this.navCtrl.push("LoginPage");
  }

  registration(){
    this.navCtrl.push("RegisterPage");
  }

}