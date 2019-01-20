import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  PopoverController
} from "ionic-angular";
import { NgForm } from "@angular/forms";
import { ShoppingListService } from "../../services/shoppingList.service";
import { Ingredient } from "../../models/ingredient";
import { SLOptionsPage } from "./sl-options/sl-options";
import { AuthService } from "../../services/auth";

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
    private authService: AuthService
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
    const popover = this.popOverCtrl.create(SLOptionsPage);
    popover.present({ ev: event });
    popover.onDidDismiss(data => {
      if (data.action == "load") {
      } else {
        this.authService
          .getActiveUser()
          .getIdToken()
          .then((token: string) => {})
          .catch(error => {
            console.log(error);
          });
      }
    });
  }
}
