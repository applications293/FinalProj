import { HomePage } from './../home/home';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ActionSheetController,Platform, LoadingController  } from 'ionic-angular';
import { Camera,CameraOptions,PictureSourceType  } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { userProfileObj } from '../../models/userProfile.mocks';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var firebase;

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user: any;
  currentUser: any;
  imageURI: string;

  fullNameDisabled : Boolean; 

  profileForm : FormGroup;
  isValid: boolean;
  numberDisabled: boolean;

  constructor(public loadingCtrl: LoadingController,public menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController,private camera: Camera,private platform:Platform,private filePath: FilePath,private f:File,  public formBuilder: FormBuilder) {
    this.isValid = true;
    this.numberDisabled = true;
    this.fullNameDisabled = true;

    this.profileForm = this.formBuilder.group({
      fullName: ['',Validators.compose([Validators.required, Validators.pattern('[A-Za-z]*')])],
      //'[0-9.e]{10}'
      //'/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im'
      Number: ['',Validators.compose([ Validators.pattern('[0-9.e]{10}')])]
      //Validators.required,
    });
  
  }

  ionViewDidLoad() {
    
    this.menuCtrl.enable(false, 'myMenu')

    this.user = firebase.auth().currentUser;
    console.log(this.user);
    console.log(this.user.photoURL);
    this.currentUser = null;
    if(this.user != null){
      console.log(this.user.uid)
      firebase.database().ref('comm/'+this.user.uid).once('value', (snapshot) =>{
        this.currentUser = snapshot;
        console.log(snapshot.val().fullName)

        // let pages = [
        //   { icon: 'calendar', title: 'Events', component: 'ViewEventPage' },
        //   { icon: 'clipboard', title: 'Reports', component: 'ListPage' },
        //   { icon: 'git-network', title: 'Suggestions', component: 'SuggestionPage' },
        //   { icon: 'globe', title: 'Jobs/Vacancies', component: 'ViewjobsPage' },
        //   { icon: 'flag', title: 'Report Member', component: 'ReportuserPage' },
        //   { icon: 'log-out', title: 'Sign Out', component: HomePage },
        // ];

        // pages.forEach(element => {
        //   sideMenuObj.push(element)
        // })
      });
    }else{
      this.navCtrl.push("LoginPage")
    }

  }

  ionChanger(){
    console.log(this.profileForm.status)
    if(this.profileForm.status === 'INVALID'){
      this.isValid = true;
    }else if(this.profileForm.status === 'VALID'){
      this.isValid = false;
    }
  }

  tapEvent(type){
    
    console.log('type = '+type);
    switch (type) {
      case 'fullName':
        this.fullNameDisabled = false;
        break;
      case 'Number':
        this.numberDisabled = false;
        break;
      default:
        this.numberDisabled = true;
        this.fullNameDisabled = true;
        break;
    }
  }

  updateUserDetails(){

    firebase.database().ref('comm/').child(this.user.uid).update({fullName:this.profileForm.value.fullName,Number: this.profileForm.value.Number}).then( result =>{
      userProfileObj.pop();
      /*let profile = [
        {username:this.profileForm.value.fullName,photoURL: this.user.photoURL}
      ]
      profile.forEach(element =>{
        userProfileObj.push(element)
      })*/

      firebase.auth().currentUser.updateProfile({
        displayName:this.profileForm.value.fullName,
        photoURL: this.user.photoURL
      });

      let userProfile = [
        {username: this.profileForm.value.fullName,photoURL: this.user.photoURL}
      ]
      userProfile.forEach(element => {
        userProfileObj.push(element);
      })
      this.navCtrl.setRoot(HomePage)
    });

    //this.ionViewDidLoad();
  }

  backToHome(){
    this.navCtrl.setRoot(HomePage);
  }

  updateProfilePic(){
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Complete action using..',
      buttons: [
        {
          text: 'Camera',
          //role: 'destructive',
          icon: 'ios-camera',
          handler: () => {
            this.takePhoto(1);
            console.log('Destructive clicked');
          }
        },{
          text: 'Gallery  ',
          icon: 'images',
          handler: () => {
            this.takePhoto(0);
            console.log('Archive clicked');
          }
        }
        // ,{
        //   text: 'Cancel',
        //   role: 'cancel',
        //   handler: () => {
        //     console.log('Cancel clicked');
        //   }
        // }
      ]
    });
    actionSheet.present();
  }

  takePhoto(sourceType:number) {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType:sourceType,
      allowEdit: true
    }

    this.camera.getPicture(options).then((imagePath) => {
      //let base64Image = 'data:image/jpeg;base64,' + imageData;
      if (this.platform.is('android') && options.sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
           // let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            //let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
           // this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
           //console.log(filePath);
           //this.conveImgtoBase64(filePath);
           console.log("file Path =========== "+ filePath)
           this.imageURI = filePath;
           if(filePath != null){

            this.saveImgToFireStorage()
            // let toast = this.toastCtrl.create({
            //   message: 'Image successfully uploaded.',
            //   duration: 3000,
            //   position: 'middle',
              
            // });
            // toast.present();
            // console.log('inside toast if')
           }
          });
      } else {
        console.log("Image Path =========== "+ imagePath)
        this.imageURI = imagePath;

        if(this.imageURI != null && imagePath != null){
          this.saveImgToFireStorage();
        }
        // var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        // var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
       // this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
     // this.presentToast('Error while selecting image.');
    });
  }

  saveImgToFireStorage(){
    //loading bar
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    loading.present();

    if(this.imageURI != null){
      var name = this.imageURI.substring(this.imageURI.lastIndexOf('/')+1, this.imageURI.length);
    console.log("Image URI ========== "+this.imageURI);
    var directory: string = this.imageURI.substring(0, this.imageURI.lastIndexOf('/')+1);
        directory = directory.split('%20').join(' ')
        name = name.split('%20').join(' ')
        console.log(directory)
        console.log('About to read buffer')
        let seperatedName = name.split('.')
        let extension = ''
        if (seperatedName.length > 1) {
          extension = '.' + seperatedName[1]
        }
    return this.f.readAsArrayBuffer(directory, name).then((buffer: ArrayBuffer) => {
      console.log(buffer)
      console.log('Uploading file')
      //var blob = new Blob([buffer], { type: mediaFile[0].type });
      var blob = new Blob([buffer], {type: 'image/jpeg'});
      console.log(blob.size);
      console.log(blob)
      const storageRef = firebase.storage().ref('Profile_Pics/' + new Date().getTime() + extension);
      return storageRef.put(blob).then((snapshot:any) => {
        console.log('Upload completed')
        //this.loader.dismiss;
        //this.firebaseUploads = firebase.database().ref('/fireuploads/');
        console.log(snapshot.Q)
        console.log("snapshot = "+snapshot);
         //let  files = [];
        storageRef.getDownloadURL().then((url) => {
         if(this.user.photoURL.indexOf('http') != -1){
           console.log("Url index "+this.user.photoURL.indexOf('http'))
            var tokens = this.user.photoURL.split(/*this.user.photoURL.lastIndexOf('%')*/ '5%'); 
            var fileName = tokens[0];
            console.log("file name = "+ fileName)
          }
          // deleteStorageRef = firebase.ref('Profile_Pics/');
          console.log('Profile Pic url = '+url)
          userProfileObj.pop();

          console.log("image name = "+name)

          

          firebase.auth().currentUser.updateProfile({ 
              photoURL: url,
              
            }).then(function() {
              // Update successful.
              let userProfile = [
                {username:firebase.auth().currentUser.displayName,photoURL:firebase.auth().currentUser.photoURL}
              ]
              userProfile.forEach(element => {
                userProfileObj.push(element);
              })

              
            }).catch(function(error) {
              console.log("error")
              //this.navCtrl.push("ProfilePage");
              // An error happened.
            });

            this.navCtrl.setRoot("ProfilePage");
          // this.fire.downloadUrl = url;
          // console.log(url);
          // //this.firebaseUploads.push({downloadUrl: url,Admin_Authentication_UID :this.userObj[0].authentication_UID,EventName:this.eventName,eventVenue:this.eventVenue, EventDate: this.eventDate,EventTime: this.eventTime, EventCategory: this.category});
          // firebase.database().ref('/Events/').push({downloadUrl: this.fire.downloadUrl,EventName:this.eventName,eventVenue:this.eventVenue, EventDate: this.eventDate,EventTime: this.eventTime, EventCategory: this.category});
           
          // return this.fire.downloadUrl;

        });
        // console.log("Download URL = "+ this.fire.downloadUrl);
        //this.firebaseUploads.push({downloadUrl: this.fire.downloadUrl,Admin_Authentication_UID :this.userObj[0].authentication_UID,EventName:this.eventName,eventVenue:this.eventVenue, EventDate: this.eventDate,EventTime: this.eventTime, EventCategory: this.category});
        //console.log(this.firebaseUploads);
        // switch (type) {
        //   case 'camera':
        //   this.files.picture = storageRef.getDownloadURL().toString();
        //   // this.uploadFile.name = "Camera Taken Picture";
        //   // this.uploadFile.downloadUrl = storageRef.getDownloadURL().toString();
        //   console.log( "url",storageRef.getDownloadURL().toString());
        //   this.uploads.push(this.uploadFile);
        //     break
        //   case 'video':
        //   // this.files.video = storageRef.getDownloadURL().toString();
        //   // this.uploadFile.name = "Camera Taken Video";
        //   this.uploadFile.downloadUrl = storageRef.getDownloadURL().toString();
        //   this.uploads.push(this.uploadFile);
        //   console.log( "url",storageRef.getDownloadURL().toString());
        //     break
        //   case 'audio':
        //   // this.files.audio = storageRef.getDownloadURL().toString();
        //   // this.uploadFile.name = "Audio Taken ";
        //  // this.uploadFile.downloadUrl = storageRef.getDownloadURL().toString();
        //   this.uploads.push(this.uploadFile);
        //   console.log( "url",storageRef.getDownloadURL().toString());
        //     break
        // }
         // this.presentMedia(type);
      })
      // return this.userService.saveProfilePicture(blob)
    }).catch(err => {
      console.log(err)
    })
    }
    // else{
    // //   this.pic_available=false
    // //  var noPic = this.pic_available;
    //   firebase.database().ref('/Events/').push({downloadUrl: 'none',EventName:this.eventName,eventVenue:this.eventVenue, EventDate: this.eventDate,EventTime: this.eventTime, EventCategory: this.category});
    //   this.navCtrl.push("ViewEventPage");
    // }
  }

}