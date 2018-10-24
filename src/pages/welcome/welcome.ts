
import { File } from '@ionic-native/file';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';


/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  slides=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,private file: File) {


}
  ionViewDidLoad() {
    console.log('WelcomePage has loaded...');
    // this.file.createFile('file:///storage/emulated/0/Android/data/io.ionic.starter/cache/','makheApp.doc',true).then((result)=>{
    //   console.log('Result ');
    //   console.log(result);


    // });

        //console.log('inside try');
        this.file.checkFile('file:///storage/emulated/0/Android/data/io.ionic.starter/cache/','makheApp.doc').then((result) => {
          console.log('result');
          console.log(result);
          if(result){
            this.navCtrl.setRoot(HomePage);
          }else{
            this.file.createFile('file:///storage/emulated/0/Android/data/io.ionic.starter/cache/','makheApp.doc',false).then((promise)=>{
              console.log('Result ');
              console.log(promise);
              this.slides = [
                {
                  title: "Welcome to the Community App!",
                  description: "The <b>Community App</b> is meant to unite communities, help find jobs,  share reviews, photos and engage with each other.",
                  image: "assets/imgs/pic1.jpg",
                  index: 0,
                },
                {
                  title: "Events!",
                  description: "All events in one simple overview. In one simple click, members can post an event and see upcoming events.",
                  image: "assets/imgs/Events.jpg",
                  index: 1,
                },
                {
                  title: "Hangouts and Social networking",
                  description: "Community member will share their experience to Facebook and Twitter.",
                  image: "assets/imgs/pic10.jpg",
                  index: 2,
                },
                {
                  title: "Share the knowledge",
                  description: "Share an interesting fact or a great suggestion with all the other members. Let others know what you think by dropping a comment.",
                  image: "assets/imgs/pic7.jpg",
                  index: 3,
                }
              ];
            });
          }
        }).catch ((error) =>{
          this.file.createFile('file:///storage/emulated/0/Android/data/io.ionic.starter/cache/','makheApp.doc',false).then((promise)=>{
            console.log('Result ');
            console.log(promise);

            this.slides = [
              {
                title: "Welcome to the Community App!",
                description: "The <b>Community App</b> is meant to unite communities, help find jobs,  share reviews, photos and engage with each other.",
                image: "assets/imgs/pic1.jpg",
                index: 0,
              },
              {
                title: "Events!",
                description: "All events in one simple overview. In one simple click, members can post an event and see upcoming events.",
                image: "assets/imgs/Events.jpg",
                index: 1,
              },
              {
                title: "Hangouts and Social networking",
                description: "Community member will share their experience to Facebook and Twitter.",
                image: "assets/imgs/pic10.jpg",
                index: 2,
              },
              {
                title: "Share the knowledge",
                description: "Share an interesting fact or a great suggestion with all the other members. Let others know what you think by dropping a comment.",
                image: "assets/imgs/pic7.jpg",
                index: 3,
              }
            ];

          });
          console.log('inside error block ' + error);})

        // this.file.createFile(this.file.cacheDirectory,'cache.txt',false).then((result)=>{
        //     console.log('Result ');
        //     console.log(result);

        //   });


    // }else{
    //   console.log('inside else');
    //   this.file.createFile(this.file.cacheDirectory,'cache.txt',false).then((result)=>{
    //     console.log('Result ');
    //     console.log(result);

    //   });


    // }

  }

  mainPage(){
    this.navCtrl.setRoot(HomePage);
  }
}
