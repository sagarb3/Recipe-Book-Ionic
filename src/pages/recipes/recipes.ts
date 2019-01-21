import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  PopoverController,
  AlertController
} from "ionic-angular";
import { EditRecipePage } from "../edit-recipe/edit-recipe";
import { Recipe } from "../../models/recipe";
import { RecipesService } from "../../services/recipes";
import { RecipePage } from "../recipe/recipe";
import { DatabaseOptionsPage } from "../database-options/database-options";
import { AuthService } from "../../services/auth";
import { HttpErrorResponse } from "@angular/common/http";

@IonicPage()
@Component({
  selector: "page-recipes",
  templateUrl: "recipes.html"
})
export class RecipesPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private recipesService: RecipesService,
    private loadingCtrl: LoadingController,
    private popOverCtrl: PopoverController,
    private alertCtrl: AlertController,
    private authService: AuthService
  ) {}
  recipes: Recipe[] = [];

  ionViewDidLoad() {
    console.log("ionViewDidLoad RecipesPage");
  }
  ionViewWillEnter() {
    this.recipes = this.recipesService.getRecipes();
  }
  onNewRecipe() {
    this.navCtrl.push(EditRecipePage, { mode: "New" });
  }

  onLoadRecipe(recipe: Recipe, index: number) {
    this.navCtrl.push(RecipePage, { recipe, index });
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
            this.recipesService.fetchList(token).subscribe(
              (list: Recipe[]) => {
                loading.dismiss();
                this.recipes = list;
              },
              (error: HttpErrorResponse) => {
                loading.dismiss();
                this.handleError(error.message);
              }
            );
          });
      } else if (data.action == "store") {
        loading.present();
        this.authService
          .getActiveUser()
          .getIdToken()
          .then((token: string) => {
            this.recipesService.storeList(token).subscribe(
              () => {
                loading.dismiss();
              },
              (error: HttpErrorResponse) => {
                loading.dismiss();
                this.handleError(error.message);
              }
            );
          })
          .catch(error => {
            this.handleError(error.message);
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
