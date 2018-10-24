import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';

declare var firebase;
@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {
  items=[];
  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
  }


  retrieveData(){
    this.items = [];
    firebase.database().ref("/comm/").on('value', (snapshot) => {
      snapshot.forEach(snap => {
        if(snap.val().role == 'user'){
          this.items.push({key: snap.key,fullName: snap.val().fullName,role: snap.val().role});
            
            //this.navCtrl.setRoot("HomePage");
          }
      });
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad UsersPage');
    this.retrieveData()
  }

  // onUpdate(key){
  //   //this.v = this.name; this is the user inside DB
  //   const alert = this.alertCtrl.create({
  //     title: 'Update Item name',
  //     message: 'Please enter item',
  //     /*subTitle: 'Please enter item',*/
  //     inputs: [
  //       {
  //         name: 'input',
  //         placeholder:'Enter Item name'
  //       }
  //     ],
  //     buttons: [{
        
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: () => {
  //           console.log('Cancel clicked');
  //         }
  //     },
  //     {
  //       text: 'Update',
  //       handler: name => {
  //         var database = firebase.database();
  //         database.ref(/comm/ +key ).set({name:name.input});
  //         this.retrieveData();
  //       }
  //     }
  //   ]
  //   });
  //   alert.present();
  // }

  onDelete(key){
    
    const alert = this.alertCtrl.create({
      title: 'Delete?',
      message: 'Are you sure you want to delete user?',
      /*subTitle: 'Please enter item',*/
     
      buttons: [{
        
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
      },
      {
        text: 'Delete',
        handler: name => {
          var database = firebase.database();
          database.ref(/comm/ + key).remove();
          this.retrieveData();
        }
      }
    ]
    });
    alert.present();
  }

}
