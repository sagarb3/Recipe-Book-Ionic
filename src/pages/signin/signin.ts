import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController
} from "ionic-angular";
import { NgForm } from "@angular/forms";
import { AuthService } from "../../services/auth";

@IonicPage()
@Component({
  selector: "page-signin",
  templateUrl: "signin.html"
})
export class SigninPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad SigninPage");
  }
  onSignin(form: NgForm) {
    console.log(form.value);
    const loading = this.loadingCtrl.create({
      content: "Signin you in..."
    });
    loading.present();
    this.authService
      .signin(form.value.email, form.value.password)
      .then(data => {
        loading.dismiss();
        //console.log(data);
      })
      .catch(error => {
        loading.dismiss();
        //console.log(error);
        const alert = this.alertCtrl.create({
          title: "Signin failed",
          message: error.message,
          buttons: ["Ok"]
        });
        alert.present();
      });
  }
}
