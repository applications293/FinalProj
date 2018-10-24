import { HomePage } from './../home/home';

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserObj } from '../../models/loggedInUser.mock';
import { sideMenuObj } from '../../models/sideMenuPages.mocks';
import { userProfileObj } from '../../models/userProfile.mocks';
import { Storage } from '@ionic/storage';

declare var firebase;
@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  todo: FormGroup;
  userSuccess: false;
  constructor(public storage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
  
    this.todo = this.formBuilder.group({
      email: ['', Validators.compose([Validators.pattern('^[a-zA-Z0-9_.+-]+[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      //Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
      fullName: ['', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      // Number: ['', Validators.required],
      address: ['', Validators.required],
      Number: ['', Validators.compose([Validators.pattern('[0-9.e]{10}'), Validators.required])],
  
      gender: ['', Validators.required],
      dof: ['', Validators.required],
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
    this.closeMenu();
  }

  closeMenu() {
    this.menuCtrl.enable(false, 'myMenu');
  }


  signUp({ value, valid }: { value: any, valid }) {

    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    loading.present();

    console.log(value);
    var databaseKey;
    var uid;
    firebase.auth().createUserWithEmailAndPassword(this.todo.value.email, this.todo.value.password).then(data => {
      this.storage.set('activeUser', data.user.email);
      data.user.updateProfile({
        displayName: this.todo.value.fullName,
        photoURL: './assets/imgs/empty.jpg'
      });
      userProfileObj.pop();
      let userProfile = [
        { username: this.todo.value.fullName, photoURL: './assets/imgs/empty.jpg' }
      ]
      userProfile.forEach(element => {
        userProfileObj.push(element);
      })
      console.log('User profile = '+userProfile)
      console.log('User email = '+this.todo.value.email);

      uid = data.user.uid;

      databaseKey = firebase.database().ref('/comm/' + (data.user.uid)).set(
        {
          email: this.todo.value.email,
          fullName: this.todo.value.fullName,
          Number: this.todo.value.Number,
          //standNumber: this.todo.value.standNumber,
          gender: this.todo.value.gender,
          dof: this.todo.value.dof,
          address: this.todo.value.address,
          role: "user"
        }
      ).key;

      UserObj.push({ role: "user" });
      let pages = [
        { icon: 'calendar', title: 'Events', component: 'ViewEventPage' },
        { icon: 'clipboard', title: 'Reports', component: 'ListPage' },
        { icon: 'git-network', title: 'Suggestions', component: 'SuggestionPage' },
        { icon: 'globe', title: 'Jobs/Vacancies', component: 'ViewjobsPage' },
        { icon: 'flag', title: 'Report Member', component: 'ReportuserPage' },
        { icon: 'log-out', title: 'Sign Out', component: HomePage },
      ];
      sideMenuObj.pop();

      pages.forEach(element => {
        sideMenuObj.push(element)
      })


      this.navCtrl.setRoot(HomePage);

      console.log("Key " + databaseKey)


    },
      error => {
        console.log('inside catch1!! ' +error)
        loading.dismiss();
        this.navCtrl.setRoot("RegisterPage")
        this.showPopup("Sign-up Error!", "The email address is already in use by another account. Please provide different email address.");
      }).catch(err => {
        console.log('inside catch2!! ' +err)
        loading.dismiss();
        this.navCtrl.setRoot("RegisterPage")
        this.showPopup("Sign-up Error!", "Please fill in all the fields");
      });

    /*if (uid == databaseKey) {
      console.log("Key " + databaseKey)
      console.log("Key " + uid)
      UserObj.push({ role: "user" });
      let pages = [
        { icon: 'calendar', title: 'Events', component: 'ViewEventPage' },
        { icon: 'clipboard', title: 'Reports', component: 'ListPage' },
        { icon: 'git-network', title: 'Suggestions', component: 'SuggestionPage' },
        { icon: 'globe', title: 'Jobs/Vacancies', component: 'ViewjobsPage' },
        { icon: 'flag', title: 'Report Member', component: 'ReportuserPage' },
        { icon: 'log-out', title: 'Sign Out', component: HomePage },
      ];
      sideMenuObj.pop();

      pages.forEach(element => {
        sideMenuObj.push(element)
      })


      this.navCtrl.setRoot(HomePage);
      //this.navCtrl.push(HomePage);
    }*/


  }



  SignIn() {

    this.navCtrl.push('LoginPage');
  }


  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: "<u>" + title + "</u>",
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: user => {
            if (this.userSuccess) {
              this.navCtrl.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }


  ForgotPassword() {

    this.navCtrl.push('ResetPage');
  }

}





