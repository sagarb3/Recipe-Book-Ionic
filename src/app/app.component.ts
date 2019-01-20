import { Component, ViewChild } from "@angular/core";
import { Platform, NavController, MenuController } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { TabsPage } from "../pages/tabs/tabs";
import { SigninPage } from "../pages/signin/signin";
import { SignupPage } from "../pages/signup/signup";
import firebase from "firebase";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  tabsPage: any = TabsPage;
  signinPage: any = SigninPage;
  signupPage: any = SignupPage;
  @ViewChild("nav") nav: NavController;
  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private menuCtrl: MenuController
  ) {
    firebase.initializeApp({
      apiKey: "AIzaSyDFGzmnhXruAwFTnXYIVBmJKhT6uiXJn1I",
      authDomain: "ionic2-recipebook-6577a.firebaseapp.com"
    });
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  onLogout() {}
  onLoad(page: any) {
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }
}
