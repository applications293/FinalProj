import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NullAstVisitor } from '@angular/compiler';
import { Observable } from 'rxjs/Observable';
/**
 * Generated class for the ContactusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var firebase;

@IonicPage()
@Component({
  selector: 'page-contactus',
  templateUrl: 'contactus.html',
})
export class ContactusPage {
  contact=[];
  name;
  email;
  contactNo;
  subject;
  message;
  contacts;
  contactus = {
    name: ''
  }



  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder) {

    //create a form with validation
    this.contacts = this.fb.group({
      name: ['', Validators.compose([Validators.minLength(4), Validators.required, Validators.pattern('[a-zA-Z]*')])],
      email: ['', Validators.compose([Validators.minLength(10), Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      contactNo: ['', Validators.compose([Validators.minLength(10), Validators.required, Validators.pattern('[0-9]*')])],
      subject: ['', Validators.compose([Validators.minLength(5), Validators.required, Validators.pattern('[a-z A-Z]*')])],
      message: ['', Validators.compose([Validators.minLength(10), Validators.required, Validators.pattern('[a-z A-Z]*')])]

    })

    this.name = this.contacts.controls['name'];
    this.email = this.contacts.controls['email'];
    this.contactNo = this.contacts.controls['contactNo'];
    this.subject = this.contacts.controls['subject'];
    this.message = this.contacts.controls['message'];

  }

  submit() {

    ////write to database
    console.log(this.contacts.value.name);
    console.log(this.contacts.value.email);
    console.log(this.contacts.value.contactNo);
    console.log(this.contacts.value.subject);
    console.log(this.contacts.value.message);

    this.contactus.name= this.name;

    var database = firebase.database();
    database.ref('/contactus/').push({ name: this.contacts.value.name, email: this.contacts.value.email,contact: this.contacts.value.contactNo,
      subject: this.contacts.value.subject, message: this.contacts.value.message });
   


  }

}
