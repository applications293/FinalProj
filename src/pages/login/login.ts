import { RegisterPage } from './../register/register';
import { userProfileObj } from './../../models/userProfile.mocks';
import { HomePage } from './../home/home';

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UserObj } from '../../models/loggedInUser.mock';
import { sideMenuObj } from '../../models/sideMenuPages.mocks';

import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GooglePlus } from '@ionic-native/google-plus';

import { Storage } from '@ionic/storage';
import { SuggestionPage } from '../suggestion/suggestion';
import { ReportsPage } from '../reports/reports';

declare var firebase;
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  //pages: Array<{ icon: any, title: string, component: any }>;
  private todo: FormGroup;
  isUserLoggedIn: any = false;
  provider: any = {};
  userLogged: any = false;

  constructor(public toastCtrl: ToastController, public gplus: GooglePlus, public storage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    //--keep this firebase code.//
    // firebase.auth().onAuthStateChanged(authData => {
    //   if (authData != null) {
    //     this.isUserLoggedIn = true;
    //     this.provider = authData;
    //     this.storage.set('activeUser', JSON.stringify(this.provider.email));
    //     // this.navCtrl.push('SuggestionPage');
    //     // console.log('Inside Constructor1' + JSON.stringify(authData));
    //     // console.log('Inside Constructor2' + JSON.stringify(this.provider.email));
    //     // console.log('Inside Constructor2' + JSON.stringify(this.provider.photoUrl));
    //     //console.log('Inside Constructor3' + JSON.stringify(authData.email));

    //   } else {
    //     this.provider = {};
    //   }
    // });

    //===

    this.todo = this.formBuilder.group({
      email: ['', Validators.compose([Validators.pattern('^[a-zA-Z_.+-]+@[a-zA-Z-]+.[a-zA-Z0-9-.]+$'), Validators.required])],
      password: ['', Validators.compose([Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'), Validators.minLength(6), Validators.maxLength(12), Validators.required])],

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.closeMenu();
  }
  closeMenu() {
    this.menuCtrl.enable(false, 'myMenu');
  }



  LogIn() {

    
     
    
  

    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    loading.present();

    let pages = [
      
      { icon: 'calendar', title: 'Events', component: 'ViewEventPage' },
      { icon: 'clipboard', title: 'Reports', component: 'ReportsPage' },
      { icon: 'git-network', title: 'Suggestions', component: 'SuggestionPage' },
      { icon: 'globe', title: 'Jobs/Vacancies', component: 'ViewjobsPage' },
      
      //{ icon: 'flag', title: 'Report Member', component: 'ReportuserPage' },
      { icon: 'contact', title: 'Contact Us', component: 'ContactusPage' },
      { icon: 'help', title: 'About', component: 'AboutPage' },
      { icon: 'log-out', title: 'Sign Out', component: HomePage }

    ];

    firebase.auth().signInWithEmailAndPassword(this.todo.value.email, this.todo.value.password).then(user => {
      this.storage.set('userDetails', { username: user.user.displayName, picture: user.user.photoURL });
      console.log("works");

      console.log('user' + user.user.email)

      this.storage.set('activeUser', user.user.email);

      firebase.database().ref("/comm/").once('value', (snapshot) => {
        snapshot.forEach((snap) => {
          if (user.user.uid == snap.key) {
            if (snap.val().role == 'Admin') {
              this.isUserLoggedIn = true;
              this.showPopup("Success", "Admin succesfully logged in");
              UserObj.push({ role: snap.val().role });
              sideMenuObj.pop();
              sideMenuObj.pop();
              sideMenuObj.pop();
              //MyApp.CURRENT_USER = firebase.auth().currentUser;
              pages.forEach(element => {
                sideMenuObj.push(element)
              })

              this.navCtrl.setRoot(HomePage);
            } else if (snap.val().role == 'user') {
              this.isUserLoggedIn = true;
              //this.showPopup("Success", "User succesfully logged  in");
              let toast = this.toastCtrl.create({
                message: 'User succesfully logged  in',
                duration: 2000,
                position: 'bottom'
              });
            
              toast.onDidDismiss(() => {
                console.log('Dismissed toast');
              });
            
              toast.present();

              UserObj.push({ role: snap.val().role });

              sideMenuObj.pop();
              sideMenuObj.pop();
              sideMenuObj.pop();

              userProfileObj.pop();
              let userProfile = [
                { username: user.user.displayName, photoURL: user.user.photoURL }
              ]
              userProfile.forEach(element => {
                userProfileObj.push(element);
              })
              // var myAppObj = new MyApp();
              // myAppObj.currentUser(firebase.auth().currentUser);

              pages.forEach(element => {
                sideMenuObj.push(element)
              })
              // let userProfile = [
              //   {username:user.}
              // ]

              this.navCtrl.setRoot(HomePage);

            } else {
              this.showPopup("Error!", "Problem Loggin In");
            }
          }

        })
        //return isfound;
      })
    },
      error => {
        loading.dismiss();
        this.showPopup("Login Error!", "Please enter correct credentials!");
      });
  }

  displayToast(message) {
    this.toastCtrl.create({ message, duration: 3000 }).present();
  }


  logInWithGoogle() {

    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    loading.present();


    //--
    if (this.platform.is('core')) {
      firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(gpRes => {
        this.displayToast('Login Success')
        this.provider = gpRes.additionalUserInfo.profile;
      }).catch(err => this.displayToast(err));
    } else {
      return this.gplus.login({
        'webClientId': '67548252761-4ra1j7h1lhaf0mlgfegeav90ben6ot01.apps.googleusercontent.com',
        'offline': true
      }).then(success => {


        let credential = firebase.auth.GoogleAuthProvider.credential(success.idToken);
        firebase.auth().signInAndRetrieveDataWithCredential(credential).then(data => {
          
          this.storage.set('userDetails', { username: data.user.displayName, picture: data.user.photoURL, provider: data.user.providerData[0].providerId });
          //console.log('DATA ==============' + JSON.stringify(data.user))
          //console.log('DATA.USER ==============' + JSON.stringify(data))
          //console.log('DATA.Provider ==============' + JSON.stringify(data.user.providerData[0].providerId))
          this.storage.set('activeUser', data.user.email);
          //console.log('Gplus data1 ' + JSON.stringify(data.user.email));
          //console.log('Gplus data2 ' + JSON.stringify(data.user.displayName));
          //console.log('Gplus data3 ' + JSON.stringify(data.user.photoURL));
          //console.log('Gplus Phone' + JSON.stringify(data.user.phoneNumber));

          firebase.database().ref('/comm/' + (data.user.uid)).set(
            {
              email: data.user.email,
              fullName: data.user.displayName,
              Number: data.user.phoneNumber,
              standNumber: '',
              gender: '',
              dof: '',
              address: '',
              role: "user"
            }
          ).key;

          let pages = [
            
            { icon: 'calendar', title: 'Events', component: 'ViewEventPage' },
            { icon: 'clipboard', title: 'Reports', component: 'ReportsPage' },
            { icon: 'git-network', title: 'Suggestions', component: 'SuggestionPage' },
            { icon: 'globe', title: 'Jobs/Vacancies', component: 'ViewjobsPage' },
            
            //{ icon: 'flag', title: 'Report Member', component: 'ReportuserPage' },
            { icon: 'contact', title: 'Contact Us', component: 'ContactusPage' },
            { icon: 'help', title: 'About', component: 'AboutPage' },
            { icon: 'log-out', title: 'Logout', component: HomePage }

          ];

          sideMenuObj.pop();
          sideMenuObj.pop();
          sideMenuObj.pop();
          userProfileObj.pop();
          let userProfile = [
            { username: data.user.displayName, photoURL: data.user.photoURL }
          ]
          userProfile.forEach(element => {
            userProfileObj.push(element);
          })
          pages.forEach(element => {
            sideMenuObj.push(element)
          })
          this.navCtrl.setRoot(HomePage);

        }).catch((err) => this.showPopup("Error!", "Please check if your device is connected."));
      }, err => {
        loading.dismiss();
        this.showPopup("Error!", "Please check if your device is connected.");
      });

    }


  }

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: "<u>" + title + "</u>",
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.isUserLoggedIn) {
              this.navCtrl.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }

  SignUp() {
    let loading = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'This is the "ios" spinner. It will dismiss after 3 seconds.',
      duration: 3000
    });

    loading.present();
    this.navCtrl.push('RegisterPage');
  }

  backBtn(){
    this.navCtrl.setRoot(HomePage)
  }

  ForgotPassword() {
    this.navCtrl.push('ResetPage');
  }

}
