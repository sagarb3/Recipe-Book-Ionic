import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { EditRecipePage } from "../edit-recipe/edit-recipe";
import { Recipe } from "../../models/recipe";
import { RecipesService } from "../../services/recipes";
import { RecipePage } from "../recipe/recipe";

@IonicPage()
@Component({
  selector: "page-recipes",
  templateUrl: "recipes.html"
})
export class RecipesPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private recipesService: RecipesService
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
}
