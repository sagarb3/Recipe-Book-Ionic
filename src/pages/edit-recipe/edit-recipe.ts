import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ActionSheetController,
  AlertController,
  ToastController
} from "ionic-angular";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { RecipesService } from "../../services/recipes";
import { Ingredient } from "../../models/ingredient";
import { Recipe } from "../../models/recipe";

@IonicPage()
@Component({
  selector: "page-edit-recipe",
  templateUrl: "edit-recipe.html"
})
export class EditRecipePage implements OnInit {
  mode = "New";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private actionSheetController: ActionSheetController,
    private alertCtrl: AlertController,
    private ToastCtrl: ToastController,
    private recipesService: RecipesService
  ) {}
  selectOptions = ["Easy", "Medium", "Hard"];
  recipeForm: FormGroup;
  recipe: Recipe;
  index: number;
  ngOnInit() {
    this.mode = this.navParams.get("mode");
    if (this.mode == "Edit") {
      this.recipe = this.navParams.get("recipe");
      this.index = this.navParams.get("index");
    }
    this.intializeForm();
  }

  private intializeForm() {
    let title = null;
    let description = null;
    let difficulty = "Medium";
    let ingredients = [];
    if (this.mode == "Edit") {
      title = this.recipe.title;
      description = this.recipe.description;
      difficulty = this.recipe.difficulty;
      for (let ingredient of this.recipe.ingredients) {
        ingredients.push(new FormControl(ingredient.name, Validators.required));
      }
    }

    this.recipeForm = new FormGroup({
      title: new FormControl(title, Validators.required),
      description: new FormControl(description, Validators.required),
      difficulty: new FormControl(difficulty, Validators.required),
      ingredients: new FormArray(ingredients)
    });
  }
  onSubmit() {
    const value = this.recipeForm.value;
    const { title, description, difficulty } = value;
    let ingredients = [];
    if (value.ingredients.length > 0) {
      ingredients = value.ingredients.map(name => {
        return new Ingredient(name, 1);
      });
    }

    if (this.mode == "Edit") {
      console.log("update recipe");
      this.recipesService.updateRecipe(
        this.index,
        title,
        description,
        difficulty,
        ingredients
      );
    } else {
      this.recipesService.addRecipe(
        title,
        description,
        difficulty,
        ingredients
      );
    }
    this.recipeForm.reset();
    this.navCtrl.popToRoot();
  }

  onManageIngredients() {
    const actionSheet = this.actionSheetController.create({
      title: "What do you want to do?",
      buttons: [
        {
          text: "Add Ingredients",
          handler: () => {
            this.createNewIngredientAlert().present();
          }
        },
        {
          text: "Remove all ingredients",
          role: "destructive",
          handler: () => {
            const fArray: FormArray = <FormArray>(
              this.recipeForm.get("ingredients")
            );
            const len = fArray.length;
            if (len > 0) {
              for (let i = len - 1; i >= 0; i--) {
                fArray.removeAt(i);
              }
            }
          }
        },
        {
          text: "Cancel",
          role: "cancel"
        }
      ]
    });
    actionSheet.present();
  }
  private createNewIngredientAlert() {
    return this.alertCtrl.create({
      title: "Add Ingreditent",
      inputs: [
        {
          name: "name",
          placeholder: "Name"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel"
        },
        {
          text: "Add",
          handler: data => {
            if (data.name.trim() == "" || data.name == null) {
              const toast = this.ToastCtrl.create({
                message: "Please enter a valid value!",
                duration: 1000,
                position: "bottom"
              });
              toast.present();
              return;
            }
            (<FormArray>this.recipeForm.get("ingredients")).push(
              new FormControl(data.name, Validators.required)
            );
            const toast = this.ToastCtrl.create({
              message: "Item added!",
              duration: 1500,
              position: "bottom"
            });
            toast.present();
          }
        }
      ]
    });
  }
}
