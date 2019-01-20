import { Component, ViewChild } from "@angular/core";
import { Platform, NavController, MenuController } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { TabsPage } from "../pages/tabs/tabs";
import { SigninPage } from "../pages/signin/signin";
import { SignupPage } from "../pages/signup/signup";
import firebase from "firebase";
import { AuthService } from "../services/auth";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage: any = TabsPage;
  signinPage: any = SigninPage;
  signupPage: any = SignupPage;
  isAuthenticated = false;
  @ViewChild("nav") nav: NavController;
  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private menuCtrl: MenuController,
    private authService: AuthService
  ) {
    firebase.initializeApp({
      apiKey: "AIzaSyDFGzmnhXruAwFTnXYIVBmJKhT6uiXJn1I",
      authDomain: "ionic2-recipebook-6577a.firebaseapp.com"
    });
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.isAuthenticated = true;
        this.rootPage = TabsPage;
      } else {
        this.isAuthenticated = false;
        this.rootPage = SigninPage;
      }
    });
  }
  onLogout() {
    this.authService.logout();
    this.menuCtrl.close();
    this.nav.setRoot(SigninPage);
  }
  onLoad(page: any) {
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }
}
