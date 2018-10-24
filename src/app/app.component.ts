import { ViewEventPage } from './../pages/view-event/view-event';
import { ViewjobsPage } from './../pages/viewjobs/viewjobs';
import { AboutPage } from './../pages/about/about';
import { GooglePlus } from '@ionic-native/google-plus';
import { sideMenuObj } from './../models/sideMenuPages.mocks';
import { userProfileObj } from './../models/userProfile.mocks';
import { HomePage } from './../pages/home/home';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import 'firebase/auth';

declare var firebase;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;


  rootPage: any = '';

  public pages: Array<{ icon: any, title: string, component: any }>;
  public userProfile: Array<{ username: any, photoURL: string }>;
  user;
  userPhotoURL;
  signedIn = false;

  constructor(public loadingCtrl: LoadingController, public gplus: GooglePlus, public storage: Storage, public alertCtrl: AlertController, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
  }

  initializeApp() {
    
    this.splashScreen.hide();
    this.platform.ready().then(() => {

      var nvCtrl = this;
      this.statusBar.show();

      this.storage.get('activeUser').then((loggedUser) => {
        console.log('User-Logged is: ' + loggedUser)

        if (loggedUser != null) {
          //this.splashScreen.hide();

          this.storage.get('userDetails').then(user => {
            console.log('User-name is: ' + user.username);
            console.log('User-pic is: ' + user.picture);

           
          // pages.forEach(element => {
          //   sideMenuObj.push(element)
          //   console.log('SideMenu PUSH'+ element.title)
          // });

          // sideMenuObj.forEach(element => {
          //   console.log('SideMenu PUSH'+ element.title)
          //     sideMenuObj.pop();
              
          //   });

          //   sideMenuObj.forEach(element => {
          //     console.log('SideMenu PUSH'+ element.title)
          //       sideMenuObj.pop();
          //     });

          console.log(sideMenuObj)
          pages.forEach(element => {
              sideMenuObj.push(element)
              console.log('SideMenu PUSH'+ element.title)
            });

            if(user.provider){
              this.gplus.trySilentLogin({
                'webClientId': '67548252761-4ra1j7h1lhaf0mlgfegeav90ben6ot01.apps.googleusercontent.com',
                'offline': false
              }).then(success =>{
                //console.log('success === '+JSON.stringify(success))
                sideMenuObj.push({ icon: 'log-out', title: 'Logout', component: HomePage })
              }).catch(err => console.log('Inside error '+err))
              //sideMenuObj.push({ icon: 'log-in', title: 'Sign In', component: 'LoginPage' })
              //sideMenuObj.push({ icon: 'log-out', title: 'Logout', component: HomePage })
            }else{
              sideMenuObj.push({ icon: 'log-out', title: 'Sign Out', component: HomePage })
            }

            userProfileObj.pop();
            let userProfile = [
              { username: user.username, photoURL: user.picture }
            ]
            userProfile.forEach(element => {
              userProfileObj.push(element);
            })
          })


          let pages = [
            { icon: 'home', title: 'Home', component: HomePage },
            
            { icon: 'calendar', title: 'Events', component: 'ViewEventPage' },
            { icon: 'clipboard', title: 'Reports', component: 'ReportsPage' },
            { icon: 'git-network', title: 'Suggestions', component: 'SuggestionPage' },
            { icon: 'globe', title: 'Jobs/Vacancies', component: 'ViewjobsPage' },
            { icon: 'contact', title: 'Contact Us', component: 'ContactusPage' },
            { icon: 'information-circle', title: 'About', component: 'AboutPage' }
            
          ];

          sideMenuObj.forEach(element => {
              console.log(element.title);
            console.log('SideMenuOBJ_POP ')
            sideMenuObj.pop();
            sideMenuObj.pop();
            
           })
          
          // sideMenuObj.forEach(element => {

          //     sideMenuObj.pop();
          //   })
          nvCtrl.nav.setRoot(HomePage);
        } else {
          sideMenuObj.push({ icon: 'contact', title: 'Contact Us', component: 'ContactusPage' }),
          sideMenuObj.push({ icon: 'information-circle', title: 'About', component: 'AboutPage' }),
          sideMenuObj.push({ icon: 'log-in', title: 'Sign In', component: 'LoginPage' })
        
        nvCtrl.nav.setRoot('WelcomePage');
          //this.splashScreen.hide();
        }

      })
      this.splashScreen.hide();
    });
    this.pages = sideMenuObj;
    this.userProfile = userProfileObj;

  }

  currentUser(user: any) {
    var loggedUser = true;
    user = firebase.auth().currentUser;
    this.storage.set('userProf', { pic: user.photoURL })
    console.log("current user " + user.photoURL);
    console.log(user);

  }

  updateProfile() {
    this.nav.setRoot("ProfilePage");
  }

  // about() {
  //   const alert = this.alertCtrl.create({
  //     title: '<hr color="blue">About App<hr color="blue">',
  //     subTitle: 'The <b>Community App</b> is meant to unite communities, information-circle find jobs,  share reviews, photos and engage with each other.<br><br>-Platform: Android <br>-App version: 1.1.0<hr color="blue"><h3>Support</h3>-makhelwaneapp@gmail.com <br>-Tell no.: (021) 800 723<br><hr color="blue">'
  //   });
  //   alert.present();
  // }

  openPage(page) {
    console.log('inside openPage')
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario

    if (page.title == "Sign Out") {
      console.log('inside General logout')

      firebase.auth().signOut().then(() => {
        console.log('inside firebase.auth().signOut()')
        

        this.storage.remove('activeUser');
        this.storage.remove('userDetails');
        // let pages: Array<{ icon: any, title: string, component: any }> = [
        //   { icon: 'home', title: 'Home', component: HomePage },
        //   { icon: 'contact', title: 'Contact Us', component: 'ContactusPage' },
        //   { icon: 'information-circle', title: 'About', component: 'AboutPage' },
        //   { icon: 'log-in', title: 'Sign In', component: 'LoginPage' }
        // ];
        // pages.forEach(element => {
        //   sideMenuObj.push(element)
        //   this.pages = pages;
        // })
        for (var i = 6; i >= 0; i--) {
          sideMenuObj.pop();
        }
        userProfileObj.pop();
        let userProfile: Array<{ username: any, photoURL: string }> = [
          { username: 'Community-App', photoURL: '../assets/imgs/logo.png' }
        ];

        userProfile.forEach(element => {
          userProfileObj.push(element);
        })
        //this.pages = pages;
        sideMenuObj.push({ icon: 'contact', title: 'Contact Us', component: 'ContactusPage' }),
        sideMenuObj.push({ icon: 'information-circle', title: 'About', component: 'AboutPage' }),
        sideMenuObj.push({ icon: 'log-in', title: 'Sign In', component: 'LoginPage' })
        
        this.nav.setRoot(page.component);
      })

    } else if (page.title == "Logout") {

      let loading = this.loadingCtrl.create({
        content: 'Please wait...',
        dismissOnPageChange: true
      });
      loading.present();
      console.log('inside elseIF Gplus')
      this.gplus.logout().then(() => {
        console.log('inside elseIF this.gplus.logout()')
        this.storage.remove('activeUser');
        this.storage.remove('userDetails');
        firebase.auth().signOut().then(() => {
        // firebase.auth().onAuthStateChanged(authData => {
        //     if (authData != null) {
        //       //this.isUserLoggedIn = true;
        //       //this.provider = authData;
        //       //this.storage.set('activeUser', JSON.stringify(this.provider.email));
        //       // this.navCtrl.push('SuggestionPage');
        //  console.log('Inside Constructor1' + JSON.stringify(authData));
        //       // console.log('Inside Constructor2' + JSON.stringify(this.provider.email));
        //       // console.log('Inside Constructor2' + JSON.stringify(this.provider.photoUrl));
        //       console.log('Inside Constructor3' + JSON.stringify(authData.email));
      
        //     } else {
             
        //       console.log('Inside else' + JSON.stringify(authData));
        //     }
        //   });
 
        // let pages: Array<{ icon: any, title: string, component: any }> = [
        //   { icon: 'home', title: 'Home', component: HomePage },
        //   { icon: 'contact', title: 'Contact Us', component: 'ContactusPage' },
        //   { icon: 'information-circle', title: 'About', component: 'AboutPage' },
        //   { icon: 'log-in', title: 'Sign In', component: 'LoginPage' }
        // ];
        // pages.forEach(element => {
        //   sideMenuObj.push(element)
        //   this.pages = pages;
        // })
        for (var i = 6; i >= 0; i--) {
          sideMenuObj.pop();
        }

        userProfileObj.pop();
        let userProfile: Array<{ username: any, photoURL: string }> = [
          { username: 'Community-App', photoURL: '../assets/imgs/logo.png' }
        ];

        userProfile.forEach(element => {
          userProfileObj.push(element);
        })
        //this.pages = pages;
        sideMenuObj.push({ icon: 'contact', title: 'Contact Us', component: 'ContactusPage' }),
        sideMenuObj.push({ icon: 'information-circle', title: 'About', component: 'AboutPage' }),
        sideMenuObj.push({ icon: 'log-in', title: 'Sign In', component: 'LoginPage' })

        this.nav.setRoot(page.component);
      })
    }, error =>{
      console.log('Google plus error'+ error) 
      loading.dismiss();
      })

    } else if (page.title == 'About') {

      const alert = this.alertCtrl.create({
        title: '<hr color="blue">About App<hr color="blue">',
        subTitle: 'The <b>Community App</b> is meant to unite communities, information-circle find jobs,  share reviews, photos and engage with each other.<br><br>-Platform: Android <br>-App version: 1.1.0<hr color="blue"><h3>Support</h3>-makhelwaneapp@gmail.com <br>-Tell no.: (021) 800 723<br><hr color="blue">'

      });
      alert.present();

    } else if(page.title == 'Sign In'){
      this.nav.push(page.component);
    }else {
      //this.userPhotoURL = this.user.photoURL;
      this.nav.setRoot(page.component);
    }

    //.--------------------------

  }
}
