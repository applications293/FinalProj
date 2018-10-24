import { UserObj } from './../../models/loggedInUser.mock';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular'; 
import moment from 'moment';  
import { TextToSpeech } from '@ionic-native/text-to-speech';
/**
 * Generated class for the SuggestionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var firebase;
@IonicPage()
@Component({
  selector: 'page-suggestion',
  templateUrl: 'suggestion.html',
})
export class SuggestionPage { 
  txtMessage:string;
  time:any; 
  date:any; 
  dislikes:number;
  username;
  suggestionList = [];
  likedUsers = [];
  disLikedUsers = [];
  count = 0;
  resultArray = [];
  user = firebase.auth().currentUser; 
  dislikeArray: string[];
  constructor(public navCtrl: NavController, public navParams: NavParams,private textToSpeech: TextToSpeech,private alertCtrl:AlertController) {
    // this.user.updateProfile({
    //   photoURL:'../../assets/imgs/hangout1.jpg'
    // })

    
    
    console.log(this.user);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SuggestionPage');  
    this.suggestionList = []; 
    this.time = moment().format('h:mm a');
    this.date = moment().format('MMMM Do YYYY'); 
    firebase.database().ref("Suggestions/").on("value",(snapshot) =>{
      snapshot.forEach(element => {
        //this.resultArray = [];
        if(element.val().reviews != null){
          
          this.resultArray = Object.keys(element.val().reviews);
          this.likedUsers = this.resultArray
          console.log("length = "+ this.resultArray.length);
        }

        if(element.val().dislikes != null){
          
          this.dislikeArray = Object.keys(element.val().dislikes);
          this.disLikedUsers = this.dislikeArray; 
          console.log("ArrayOfObject = "+ this.dislikeArray[0]);
        }
        
        this.suggestionList.push({key:element.key, suggestionMsg: element.val().suggestionMsg, reviews: this.likedUsers,dislikes: this.disLikedUsers, postedtime: element.val().postedtime, postedDate: element.val().postedDate,username:element.val().username,profilepic:element.val().profilepic})
        this.suggestionList.reverse();
        this.likedUsers = [];
        this.disLikedUsers = [];
      });
    }) 
  }
  PostSuggestion(){
  
    this.time = moment().format('h:mm a');
    this.date = moment().format('MMMM Do YYYY');
    const prompt = this.alertCtrl.create({
      title: 'Suggestion',
      message: "What is your suggestion on social development ?",
      inputs: [
        {
          name: 'Title',
          placeholder: 'Write suggestion....'
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
            this.suggestionList=[];  
             firebase.database().ref('Suggestions/').push({ suggestionMsg: data.Title,dislikes:{},reviews:{}, postedtime:this.time,postedDate:this.date,username:this.user.displayName,profilepic:this.user.photoURL})
            }
        }
      ]
    });
    prompt.present();
  }

  reviews(suggestion){ 
    //console.log(suggestion)
         //this.likedUsers = suggestion.reviews;
        // this.suggestionList = [];  
        var suggestionPostRef =  firebase.database().ref('Suggestions/'+suggestion.key);
        var reviewRef = suggestionPostRef.child('reviews/'+this.user.uid);
        var dislikesRef = suggestionPostRef.child('dislikes/'+this.user.uid);
        
        console.log('Revies == '+suggestion.reviews) 
        if(suggestion.reviews.length == 0 || suggestion.reviews.length != 0){
          // this.resultArray = Object.keys(suggestion.reviews)
          // console.log(this.resultArray);
          var userFound : boolean = false;
          suggestion.reviews.forEach(element => {
            if(element == this.user.uid){
              userFound = true;
              reviewRef.remove();
            }
          });
``
          if(userFound == false){
            reviewRef.set({user:this.user.displayName});
            suggestion.dislikes.forEach(element => {
              if(element == this.user.uid){
                // userFound = true;
                dislikesRef.remove();
              }
            });
          }

        }else{
          reviewRef.set({user:this.user.displayName});
        }
        // this.resultArray = [];
        this.ionViewDidLoad(); 
    }
    
    Speak(suggestion){
      this.textToSpeech.speak(suggestion.suggestionMsg)
      .then(() => console.log('Success'))
      .catch((reason: any) => console.log(reason));
    }

    dislike(suggestion){
      // suggestion.dislikes = suggestion.dislikes + 1;
      // this.suggestionList = [];
      //  firebase.database().ref('Suggestions/'+suggestion.key).update({ suggestionMsg: suggestion.suggestionMsg, dislikes:suggestion.dislikes, postedtime:suggestion.postedtime, postedDate: suggestion.postedDate});

      var suggestionPostRef =  firebase.database().ref('Suggestions/'+suggestion.key);
        var dislikesRef = suggestionPostRef.child('dislikes/'+this.user.uid);
        var reviewRef = suggestionPostRef.child('reviews/'+this.user.uid);  
        
        console.log('Revies == '+suggestion.reviews) 
        if(suggestion.reviews.length == 0 || suggestion.reviews.length != 0){
          // this.resultArray = Object.keys(suggestion.reviews)
          // console.log(this.resultArray);
          var userFound : boolean = false;
          suggestion.dislikes.forEach(element => {
            if(element == this.user.uid){
              userFound = true;
              dislikesRef.remove();
              suggestion.reviews.forEach(element => {
                if(element == this.user.uid){
                  userFound = true;
                  reviewRef.remove();
                }
              });
            }
          });

          if(userFound == false){
            dislikesRef.set({user:this.user.displayName});
            suggestion.reviews.forEach(element => {
              if(element == this.user.uid){
                // userFound = true;
                reviewRef.remove();
              }
            });
  
          }

        }else{
          dislikesRef.set({user:this.user.displayName});
        }
        // this.resultArray = [];
        this.ionViewDidLoad(); 
       
     }

     Report(){
      const prompt = this.alertCtrl.create({
        title: 'Report User',
        message: "Report user about a bad content ?",
        inputs: [
          {
            name: 'Title',
            placeholder: 'Write suggestion....'
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
              this.suggestionList=[];  
               firebase.database().ref('Suggestions/').push({ suggestionMsg: data.Title,dislikes:{},reviews:{}, postedtime:this.time,postedDate:this.date,username:this.user.displayName,profilepic:this.user.photoURL})
              }
          }
        ]
      });
      prompt.present();
     }
}
