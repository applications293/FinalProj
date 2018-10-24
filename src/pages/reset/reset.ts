import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController } from 'ionic-angular';

declare var firebase;
@IonicPage()
@Component({
  selector: 'page-reset',
  templateUrl: 'reset.html',
})
export class ResetPage {

  private todo : FormGroup;
  email;
  userSuccess:false;
  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams,private formBuilder: FormBuilder,private toastCtrl: ToastController) {
    this.todo = this.formBuilder.group({
      email: ['', Validators.compose([Validators.pattern('^[a-zA-Z_.+-]+@[a-zA-Z-]+.[a-zA-Z0-9-.]+$'), Validators.required])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPage');
  }


  reset(){
    //var auth = firebase.auth();
    var emailAddress = this.email;
    console.log(emailAddress)

      // Email sent.
       if(emailAddress==''){
        console.log('Inavalid email')
       }else{
        firebase.auth().sendPasswordResetEmail(this.todo.value.email).then(()=> {
          const toast = this.toastCtrl.create({
            message: "Email was successfully sent to "+this.todo.value.email,
            showCloseButton: true,
            closeButtonText: 'Ok',
            position: 'middle'
          });
          toast.onDidDismiss(()=>{
            console.log('toast button cliked..')
            
          });
          toast.present();
    
       }).catch((error)=> {
          // An error happened.
          var errorCode = error.code;
          var errorMessage = error.message
          const toast = this.toastCtrl.create({
            message: errorMessage,
            showCloseButton: true,
            closeButtonText: 'Ok',
            position: 'middle'
          });
          toast.onDidDismiss(() => {
            console.log('Dismissed toast');
          });
        
          toast.present(); 
        });
       }
      
  }
}
