import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { RecipesPage } from "../recipes/recipes";
import { ShoppingListPage } from "../shopping-list/shopping-list";

@IonicPage()
@Component({
  selector: "page-tabs",
  templateUrl: "tabs.html"
})
export class TabsPage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  recipesPage: any = RecipesPage;
  shoppingListPage: any = ShoppingListPage;
}
