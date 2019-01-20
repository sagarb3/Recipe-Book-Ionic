import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { RecipesService } from "../../services/recipes";
import { Recipe } from "../../models/recipe";
import { EditRecipePage } from "../edit-recipe/edit-recipe";
import { ShoppingListService } from "../../services/shoppingList.service";

@IonicPage()
@Component({
  selector: "page-recipe",
  templateUrl: "recipe.html"
})
export class RecipePage implements OnInit {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private recipesService: RecipesService,
    private shoppingListService: ShoppingListService
  ) {}
  recipe: Recipe;
  index: number;
  ionViewDidLoad() {
    console.log("ionViewDidLoad RecipePage");
  }
  ngOnInit() {
    this.recipe = this.navParams.get("recipe");
    this.index = this.navParams.get("index");
  }
  onAddIngredients() {
    this.shoppingListService.addItems(this.recipe.ingredients);
  }
  onEditRecipe() {
    this.navCtrl.push(EditRecipePage, {
      mode: "Edit",
      recipe: this.recipe,
      index: this.index
    });
  }
  onDeleteRecipe() {
    this.recipesService.removeRecipe(this.index);
    this.navCtrl.popToRoot();
  }
}
