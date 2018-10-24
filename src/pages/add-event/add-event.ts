import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform, LoadingController, ToastController } from 'ionic-angular';
import { Camera,CameraOptions,PictureSourceType  } from '@ionic-native/camera';
//import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
//import { UserObj } from '../../mocks/loggedInUser.mocks';

declare var firebase
@IonicPage()
@Component({
  selector: 'page-add-event',
  templateUrl: 'add-event.html',
})
export class AddEventPage {
  // eventName;
  // eventDate;
  // eventTime;
  // category;
  // eventVenue;
  selectedImage: string;

  fire={
    downloadUrl:''
  };
  //firebaseUploads: any;
  imageURI: any;
  pic_available: boolean;
  //user
  //userObj;

  eventForm: FormGroup;


  constructor(private toastCtrl: ToastController,public loadingCtrl: LoadingController,public navCtrl: NavController, public navParams: NavParams, private camera: Camera,private platform:Platform,private filePath: FilePath,private f:File, public formBuilder: FormBuilder) {
    //this.firebaseUploads = firebase.database().ref('/fireuploads/');
   // this.firebaseUploads = firebase.database().ref('/fireuploads/');
   /*console.log("Add Event user ID = "+UserObj[0].authentication_UID);
   this.userObj = UserObj[0].authentication_UID;*/

   this.eventForm = this.formBuilder.group({
    eventName: ['', Validators.required],
    eventDescp: ['', Validators.required],
    eventVenue: ['', Validators.required],
    eventDate: ['', Validators.required],
    eventTime: ['',Validators.required],
    category: ['', Validators.required]
    
  });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddEventPage');
  }

  uploadPic(){
      this.takePicture();


    /*const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    }

    console.log("File URL = "+options.destinationType);
    this.getPicture();
    /*console.log("Options = "+ options.destinationType[2])

    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     //console.log(imageData);
    }, (err) => {
     // Handle error
    });*/


  }

/*getPicture(/*sourceType: PictureSourceType) {
    this.camera.getPicture({

      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
     // this.imageURL =destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      /*allowEdit: true,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }).then((imageData) => {
      console.log("ImageDAta1 = "+imageData);
      //this.selectedImage = imageData;
      this.selectedImage = `data:image/jpeg;base64,${imageData}`;
      console.log("Image Data2 = "+imageData);
      console.log("Selected Image = "+this.selectedImage);
      //this.conveImgtoBase64(imageData);
      /*let stringPic = this.camera.DestinationType.FILE_URI;
      console.log("String pic = "+stringPic);
      ////
      var blob = new Blob(imageData);
      const storageRef = firebase.storage().ref('files/' + new Date().getTime());
      return storageRef.put(blob)
    });
}*/

  /*conveImgtoBase64(filePath:string){
    this.base64.encodeFile(filePath).then((base64File: string) => {
      //console.log("Base64 = "+base64File.split("data:image/*;charset=utf-8;base64,",1));
      //let tokes = base64File.substr(34);
      console.log("base64 ="+base64File);
      //this.selectedImage = 'data:image/jpeg;base64,' + tokes;
      this.selectedImage = 'data:image/jpeg;base64,' + base64File;
      //this.selectedImage = base64File;
    }, (err) => {
      console.log(err);
    });

  }*/

  addEvent(){

  }

  getImage(){
    var storageREf =  firebase.storage().ref('files/logo.jpg').getDownloadURL().then(function(url) {
      // `url` is the download URL for 'images/stars.jpg'
      console.log("URL = " +url);
      // This can be downloaded directly:
      // var xhr = new XMLHttpRequest();
      // xhr.responseType = 'blob';
      // xhr.onload = function(event) {
      //   var blob = xhr.response;

      // };
      // xhr.open('GET', url);
      // xhr.send();

      // Or inserted into an <img> element:
      // var img = document.getElementById('myimg');
      // img.src = url;
    }).catch(function(error) {
      // Handle any errors
      console.log(error);
    });

  }

  saveImgToFireStorage(eventForm){
    //loading bar
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    loading.present();

    if(this.imageURI !=null){
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
      const storageRef = firebase.storage().ref('files/' + new Date().getTime() + extension);
      return storageRef.put(blob).then((snapshot:any) => {
        console.log('Upload completed')
        //this.loader.dismiss;
        //this.firebaseUploads = firebase.database().ref('/fireuploads/');
        console.log(snapshot.Q)
        console.log("snapshot = "+snapshot);
         //let  files = [];
        storageRef.getDownloadURL().then((url) => {
          this.fire.downloadUrl = url;
          console.log(url);
          //this.firebaseUploads.push({downloadUrl: url,Admin_Authentication_UID :this.userObj[0].authentication_UID,EventName:this.eventName,eventVenue:this.eventVenue, EventDate: this.eventDate,EventTime: this.eventTime, EventCategory: this.category});
          firebase.database().ref('/Events/').push({downloadUrl: this.fire.downloadUrl,EventName:this.eventForm.value.eventName,eventDescp: this.eventForm.value.eventDescp,eventVenue:this.eventForm.value.eventVenue, EventDate: this.eventForm.value.eventDate,EventTime: this.eventForm.value.eventTime, EventCategory: this.eventForm.value.category});
          this.navCtrl.setRoot("ViewEventPage");
          return this.fire.downloadUrl;

        });
        console.log("Download URL = "+ this.fire.downloadUrl);
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
    }else{
    //   this.pic_available=false
    //  var noPic = this.pic_available;
      firebase.database().ref('/Events/').push({downloadUrl: 'none',EventName:this.eventForm.value.eventName,eventDescp: this.eventForm.value.eventDescp,eventVenue:this.eventForm.value.eventVenue, EventDate: this.eventForm.value.eventDate,EventTime: this.eventForm.value.eventTime, EventCategory: this.eventForm.value.category});
      this.navCtrl.push("ViewEventPage");
    }
  }

public takePicture(/*sourceType*/) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      //sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      //let tokes = imagePath.substr(34);
      //console.log("Base64 = " +imagePath);
      //this.selectedImage = 'data:image/jpeg;base64,' + imagePath;
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

            let toast = this.toastCtrl.create({
              message: 'Image successfully uploaded.',
              duration: 2000,
              position: 'bottom',
              
            });
            toast.present();
            console.log('inside toast if')
           }
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
       // this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
     // this.presentToast('Error while selecting image.');
    });
  }

}
