import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  PopoverController,
  LoadingController,
  AlertController
} from "ionic-angular";
import { NgForm } from "@angular/forms";
import { ShoppingListService } from "../../services/shoppingList.service";
import { Ingredient } from "../../models/ingredient";
import { DatabaseOptionsPage } from "../database-options/database-options";
import { AuthService } from "../../services/auth";
import { HttpErrorResponse } from "@angular/common/http";

@IonicPage()
@Component({
  selector: "page-shopping-list",
  templateUrl: "shopping-list.html"
})
export class ShoppingListPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private slService: ShoppingListService,
    private popOverCtrl: PopoverController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}
  ingredientList: Ingredient[] = [];
  ionViewWillEnter() {
    this.updateIngreditentList();
  }

  onAddItem(form: NgForm) {
    this.slService.addItem(form.value.ingredient, form.value.amount);
    form.reset();
    this.updateIngreditentList();
  }
  updateIngreditentList() {
    this.ingredientList = this.slService.getItems();
  }
  onCheckItem(index: number) {
    this.slService.removeItem(index);
    this.updateIngreditentList();
  }
  onShowOptions(event: MouseEvent) {
    const loading = this.loadingCtrl.create({
      content: "Please wait"
    });
    const popover = this.popOverCtrl.create(DatabaseOptionsPage);
    popover.present({ ev: event });
    popover.onDidDismiss(data => {
      if (!data) {
        return;
      }
      if (data.action == "load") {
        loading.present();
        this.authService
          .getActiveUser()
          .getIdToken()
          .then((token: string) => {
            this.slService.fetchList(token).subscribe(
              (list: Ingredient[]) => {
                loading.dismiss();
                if (list) {
                  this.ingredientList = list;
                } else {
                  this.ingredientList = [];
                }
              },
              (error: HttpErrorResponse) => {
                loading.dismiss();

                this.handleError(error.message);
                //console.log(error);
              }
            );
          });
      } else if (data.action == "store") {
        loading.present();
        this.authService
          .getActiveUser()
          .getIdToken()
          .then((token: string) => {
            this.slService.storeList(token).subscribe(
              () => {
                loading.dismiss();
                //console.log("success");
              },
              (error: HttpErrorResponse) => {
                loading.dismiss();
                this.handleError(error.message);
                // console.log(error);
              }
            );
          })
          .catch(error => {
            this.handleError(error.message);
            //console.log(error);
          });
      }
    });
  }
  handleError(errorMessage: string) {
    const alert = this.alertCtrl.create({
      title: "An error occured",
      message: errorMessage,
      buttons: ["Ok"]
    });
    alert.present();
  }
}
