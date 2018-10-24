
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, LoadingController,AlertController, Refresher } from 'ionic-angular';
import { JobspopoverComponent } from '../../components/jobspopover/jobspopover';

 declare var firebase;

@IonicPage()
@Component({
  selector: 'page-viewjobs',
  templateUrl: 'viewjobs.html',
})
export class ViewjobsPage {
  eventsList = [];
  categoryList=[];

  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams,public popoverCtrl: PopoverController,private alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
    this.getDataFromDB();
    console.log('ionViewDidLoad ViewEventPage');
  }

  addEvent(){
    this.navCtrl.push("AddjobPage");
  }

  getDataFromDB(){
    this.eventsList = [];
    let loading = this.loadingCtrl.create({
      duration: 9000,
      content: 'Please wait...',
      //dismissOnPageChange: true
     
    });
    loading.present(); 

    firebase.database().ref('/Jobs/').once('value', (snapshot) =>
    {
      snapshot.forEach((snap) =>
      {
        this.eventsList.push({_key : snap.key, EventCategory: snap.val().JobCategory, EventDate: snap.val().postClosingDate, EventName : snap.val().jobDescp,JobDetail:snap.val().JobDetail, EventTime: snap.val().EventTime, downloadUrl: snap.val().downloadUrl});
       console.log(snap.val().downloadUrl);
       console.log(this.eventsList); 
        return false;
      });
      this.eventsList.reverse();
      this.categoryList = this.eventsList;
      console.log(this.categoryList)
    });

    //loading.dismiss();
    console.log(this.eventsList);
  }

  doRefresh(refresher: Refresher){
    this.ionViewDidLoad();
    refresher.complete();
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(JobspopoverComponent);
    popover.present({
     ev: myEvent
    });

    /*
    {name:''},
      {name:''},
      {name:''},
      {name:''},
      {name:''},
      {name:''},
      {name:''},
      {name: 'Other'}
    */

    popover.onDidDismiss(popoverData =>{
      try {
        if(popoverData.name == 'Freelancer'){
          this.categoryList = [];

          for (let event of this.eventsList) {
            if(event.EventCategory == 'sc'){
              this.categoryList.push(event);

            }
          }
        }else if(popoverData.name == 'Plumber'){
          this.categoryList = [];

          for (let event of this.eventsList) {
            if(event.EventCategory == 'ts'){
              this.categoryList.push(event);

            }
          }
        }else if(popoverData.name == 'Gardner'){
          this.categoryList = [];

          for (let event of this.eventsList) {
            if(event.EventCategory == 'ei'){
              this.categoryList.push(event);

            }
          }
        }else if(popoverData.name == 'Technical support assistance'){
          this.categoryList = [];

          for (let event of this.eventsList) {
            if(event.EventCategory == 'ae'){
              this.categoryList.push(event);

            }
          }
        }else if(popoverData.name == 'DataBase Administrator'){
          this.categoryList = [];

          for (let event of this.eventsList) {
            if(event.EventCategory == 'se'){
              this.categoryList.push(event);

            }
          }
        }else if(popoverData.name == 'Accountant'){
          this.categoryList = [];

          for (let event of this.eventsList) {
            if(event.EventCategory == 'pe'){
              this.categoryList.push(event);

            }
          }
        }else if(popoverData.name == 'Clark'){
          this.categoryList = [];

          for (let event of this.eventsList) {
            if(event.EventCategory == 'ee'){
              this.categoryList.push(event);

            }
          }
        }else if(popoverData.name == 'All Jobs'){
          this.categoryList = [];
          this.categoryList = this.eventsList;
        }else if(popoverData.name == 'Other'){
          this.categoryList = [];

          for (let event of this.eventsList) {
            if(event.EventCategory == 'other'){
              this.categoryList.push(event);

            }
          }
        }
      } catch (error) {
        console.log("No item selected");
      }
    });

  }
  eventDetails(event:any){

    console.log(event.EventCategory)

    this.navCtrl.push("EventDetailsPage",{event:event});
  }

  presentAlert(event) {
    console.log(event.downloadUrl);
    var category: string;
    switch (event.EventCategory) {
      case 'sc':
        category = 'Freelancer';
        break;
      case 'ts':
      category = 'Plumber';
      break;
      case 'ei':
        category = 'Gardner';
        break;
      case 'ae':
        category = 'Technical support assistance';
        break;
      case 'se':
        category = 'DataBase Administrator';
        break;
      case 'pe':
        category = 'Accountant';
        break;
      case 'ee':
        category = 'Clark';
        break;
    
      default:
        category = 'Other'
        break;
    }

    var imageURL = '../../assets/imgs/logo.jpg';
    if(event.downloadUrl != 'none'){
      imageURL = event.downloadUrl;
    }

    let alert = this.alertCtrl.create({
      cssClass: 'imgAlert',
      title: ' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+category,
      subTitle: '<img src="'+imageURL+'" width="100%" height="100%" />'+'<br><br>'+event.EventName,
      buttons: ['Dismiss']
    });
    alert.present();
  }


}
