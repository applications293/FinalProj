import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

/*
  Generated class for the NewsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NewsProvider {

  constructor(public http: HttpClient, public alertCtrl: AlertController) {
    console.log('NewsProvider has loaded..');
  }

  getApiData() {
    try {
      return this.http.get('https://newsapi.org/v2/top-headlines?sources=news24&apiKey=db27d30551424682927f1ed499a3b706');
    } catch (error) {
      console.log("inside catch")

      let alert = this.alertCtrl.create({
        title: 'Connection Faild!',
        subTitle: 'Please switch on your mobile data!',
        buttons: ['OK']
      }).present();
    }
    
  }
}
