
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import moment from 'moment';
/**
 * Generated class for the ReportsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var firebase;
@IonicPage()
@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
})
export class ReportsPage {
  reportsList = [];
  time:any;
  user = firebase.auth().currentUser; 
  constructor(public navCtrl: NavController, public navParams: NavParams,private alertCtrl:AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportsPage');
    this.time = moment().format('h:mm a');
    this.reportsList = [];
    firebase.database().ref("Reports/").once("value",(snapshot) =>{
      snapshot.forEach(element => {
        this.reportsList.push({key:element.key, postedReport: element.val().postedReport, postedtime: element.val().postedtime,username:element.val().username,profilepic:element.val().profilepic})
        this.reportsList.reverse();
      })
    });
  }
  PostReport(){
  
    this.time = moment().format('h:mm a');
    const prompt = this.alertCtrl.create({
      title: 'Report',
      message: "What needs to be reported ?",
      inputs: [
        {
          name: 'Title',
          placeholder: 'Write report....'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Post',
          handler: data => { 
            this.reportsList=[];  
             firebase.database().ref('Reports/').push({ postedReport: data.Title, postedtime:this.time,username:this.user.displayName,profilepic:this.user.photoURL}).then(result => {
               this.navCtrl.setRoot('ReportsPage');
             } )
            }
        }
      ]
    });
    prompt.present();
  }

}
