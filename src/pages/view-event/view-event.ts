
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, LoadingController, AlertController, Refresher } from 'ionic-angular';
import { EventDetailsPage } from '../event-details/event-details';
import { HomePopoverComponent } from '../../components/home-popover/home-popover';


 declare var firebase;

@IonicPage()
@Component({
  selector: 'page-view-event',
  templateUrl: 'view-event.html',
})
export class ViewEventPage {
  eventsList = [];
  categoryList=[];

  constructor(public loadingCtrl: LoadingController ,public navCtrl: NavController, public navParams: NavParams,public popoverCtrl: PopoverController,private alertCtrl: AlertController) {
    
  }

  ionViewDidLoad() {
    this.eventsList = [];
    this.getDataFromDB();
    console.log('ionViewDidLoad ViewEventPage');
  }
  addEvent(){
    this.navCtrl.push("AddEventPage");
  }

  getDataFromDB(){
    this.eventsList = [];
    let loading = this.loadingCtrl.create({
      duration: 9000,
      content: 'Getting Events. Please wait...',
      //dismissOnPageChange: true
    });

    loading.present();

    firebase.database().ref('/Events/').once('value', (snapshot) =>
    {
      snapshot.forEach((snap) => 
      { 
        //Initializing Item;
        /*this.item._key = snap.key;
        this.item.name = snap.val().c_itemName;*/
        //Adding Item to itemsList
        console.log(snap.val().EventTime)
        this.eventsList.push({_key : snap.key, EventCategory: snap.val().EventCategory, EventDate: snap.val().EventDate, EventName : snap.val().EventName, EventTime: snap.val().EventTime, downloadUrl: snap.val().downloadUrl, eventDescp:snap.val().eventDescp, eventVenue: snap.val().eventVenue});
       console.log(snap.val().downloadUrl);
       console.log(this.eventsList);
        return false;
      });
      this.eventsList.reverse();
      this.categoryList = this.eventsList;
    });

    console.log(this.eventsList);
    //loading.dismiss();
  }

  doRefresh(refresher: Refresher){
    this.ionViewDidLoad();
    refresher.complete();
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(HomePopoverComponent);
    popover.present({
     ev: myEvent
    });

    popover.onDidDismiss(popoverData =>{
      try {
        if(popoverData.name == 'Seminars and Conferences'){
          this.categoryList = [];
      
          for (let event of this.eventsList) {
            if(event.EventCategory == 'sc'){
              this.categoryList.push(event);
              
            }
          }
        }else if(popoverData.name == 'Trade Shows'){
          this.categoryList = [];
      
          for (let event of this.eventsList) {
            if(event.EventCategory == 'ts'){
              this.categoryList.push(event);
              
            }
          }
        }else if(popoverData.name == 'Executive Retreats and Incentive Programs'){
          this.categoryList = [];
      
          for (let event of this.eventsList) {
            if(event.EventCategory == 'ei'){
              this.categoryList.push(event);
              
            }
          }
        }else if(popoverData.name == 'Appreciation Events'){
          this.categoryList = [];
      
          for (let event of this.eventsList) {
            if(event.EventCategory == 'ae'){
              this.categoryList.push(event);
              
            }
          }
        }else if(popoverData.name == 'Sport Events'){
          this.categoryList = [];
      
          for (let event of this.eventsList) {
            if(event.EventCategory == 'se'){
              this.categoryList.push(event);
              
            }
          }
        }else if(popoverData.name == 'Product Launch Events'){
          this.categoryList = [];
      
          for (let event of this.eventsList) {
            if(event.EventCategory == 'pe'){
              this.categoryList.push(event);
              
            }
          }
        }else if(popoverData.name == 'Entertainment Events'){
          this.categoryList = [];
      
          for (let event of this.eventsList) {
            if(event.EventCategory == 'ee'){
              this.categoryList.push(event);
              
            }
          }
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
    var imageURL = '../../assets/imgs/logo.jpg';
    if(event.downloadUrl != 'none'){
      imageURL = event.downloadUrl;
    }
    let alert = this.alertCtrl.create({
      cssClass: 'imgAlert',
      title: ' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+event.EventName,
      subTitle: '<img src="'+imageURL+'" width="100%" height="100%" />'+'<br><br>'+event.eventDescp,
      buttons: ['Dismiss']
    });
    alert.present();
  }

}
