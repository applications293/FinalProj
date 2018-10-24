import { RegisterPage } from './../register/register';

import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/';
import { HttpClient } from '@angular/common/http';
import { NewsProvider } from './../../providers/news/news';
import { Component } from '@angular/core';
import { NavController, InfiniteScroll, Refresher, MenuController, LoadingController, AlertController } from 'ionic-angular';
import moment from 'moment';
import { UserObj } from '../../models/loggedInUser.mock';
import { userProfileObj } from '../../models/userProfile.mocks';

declare var firebase;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  date: any;
  data: any;
  feeds = [];
  scroll: any;
  timeAgo;
  username : string;
  items = [];
  adminBtn: number = 0;
  loading = LoadingController;
  showDiv: number;
  // user = firebase.auth().currentUser;
  constructor(public alertCtrl: AlertController, public loadingCtrl: LoadingController ,public menuCtrl: MenuController, private inAppBrowser: InAppBrowser, public navCtrl: NavController, public apiData: NewsProvider, private http: HttpClient) {
    // this.timeAgo = moment.utc(this.note.created_at).fromNow();
     
  }

  ionViewDidLoad() {
    
    this.menuCtrl.enable(true, 'myMenu');
    
    try {
      if(UserObj.length != 0){
        console.log('User loged In')
        if (UserObj[0].role == "Admin") {
          this.adminBtn = 1;

          this.loadApi();
        } else if (UserObj[0].role == "user") {
          
          this.adminBtn = 2;
          this.loadApi();
        }
      }else{
        console.log('No User loged In')
        this.loadApi();
      }
      
    } catch (error) {
      
        //this.loadApi();
      
      console.log('catched...');
      //this.navCtrl.setRoot('RegisterPage');
    }
  }



  news24(url) {

    let browser = new InAppBrowser();
    browser.create(url);

    const options: InAppBrowserOptions = {
      zoom: 'no'
    }
  }

  loadApi() {
    

    //find more about time frames..
        //we used this for now bcoz current api doesnt have createdTime of the post.
       
        
    try {
      var loading = this.loadingCtrl.create({
      duration: 5000,
      content: 'Please wait...',
      //dismissOnPageChange: true
    }).present();

      moment.locale('en');
      this.timeAgo = moment().startOf('hour').fromNow();

      
      console.log('HomeePage has loaded.. ');
      console.log('inside try on home page')

      this.apiData.getApiData().subscribe(apidata => { 
        this.data = apidata;
        //console.log(this.data);
        //this.feeds.push(this.data);
        for (var i = 0; i < 10; i++) {
          this.feeds.push(this.data.articles[i]);
          this.data.articles[i].publishedAt = new Date().toDateString().substr(11, 6);
          var nn = this.data.articles[i].publishedAt;

          this.data.articles[i].publishedAt = new Date().toDateString().substr(0, 10) + ', ' + nn; 
        }
      },error => {
        console.log('inside error end function on home page')
        //loading.dismiss();
        // this.showPopup("Login Error!", "Please enter correct credentials!");

        let alert = this.alertCtrl.create({
          title: 'Connection Failed!',
          subTitle: 'Please check your network connection or switch on your mobile data!',
          buttons: [{
            text: 'OK',
            handler: data => {
              this.showDiv = 0;
            }
          }]
        }).present();
      });
    } catch (error) {
      console.log('inside catch on home page')
    }
  }

  // // Opening a URL and returning an InAppBrowserObject
  // const browser = this.inAppBrowser.create(url, '_self', options);

  // // Inject scripts, css and more with browser.X


  doRefresh(refresher: Refresher) {
    console.log('Begin async operation', refresher);
    this.feeds = []; //empty the array..set to default
    this.ionViewDidLoad(); //relaod and repopulate the feeds if theres new updates
    refresher.complete();
    setTimeout(() => {
      console.log('Async operation has ended');

    }, 2000);
  }

  // doInfinite(refresher: Refresher) {
  //   console.log('Begin async operation');
  //   this.feeds = [];
  //   this.ionViewDidLoad();
  //   //refresher.complete();
  //   // return new Promise((resolve) => {


  //   //       console.log('Async operation has ended');
  //   //       resolve();

  //   //   })
  //   //   refresher.complete();
  // }

  admin() {
    this.navCtrl.push('UsersPage');
  }

}
