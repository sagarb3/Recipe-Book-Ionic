import { Recipe } from "../models/recipe";
import { Ingredient } from "../models/ingredient";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth";
import "rxjs/Rx";
@Injectable()
export class RecipesService {
  private recipes: Recipe[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  addRecipe(
    title: string,
    description: string,
    difficulty: string,
    ingredients: Ingredient[]
  ) {
    this.recipes.push(new Recipe(title, description, difficulty, ingredients));
  }

  getRecipes() {
    return this.recipes.slice();
  }
  updateRecipe(
    index: number,
    title: string,
    description: string,
    difficulty: string,
    ingredients: Ingredient[]
  ) {
    this.recipes[index] = new Recipe(
      title,
      description,
      difficulty,
      ingredients
    );
    console.log(this.recipes);
  }

  removeRecipe(index) {
    this.recipes.splice(index, 1);
  }
  storeList(token: string) {
    const userId = this.authService.getActiveUser().uid;
    return this.http.put(
      "https://ionic2-recipebook-6577a.firebaseio.com/" +
        userId +
        "/recipes.json?auth=" +
        token,
      this.recipes
    );
  }
  fetchList(token: string) {
    const userId = this.authService.getActiveUser().uid;
    return this.http
      .get(
        "https://ionic2-recipebook-6577a.firebaseio.com/" +
          userId +
          "/recipes.json?auth=" +
          token
      )

      .do((data: Recipe[]) => {
        const recipes: Recipe[] = data ? data : [];
        for (let item of recipes) {
          if (!item.hasOwnProperty("ingredients")) {
            item.ingredients = [];
          }
        }
        if (data) {
          this.recipes = recipes;
        } else {
          this.recipes = [];
        }
      });
  }
}
