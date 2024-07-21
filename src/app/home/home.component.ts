import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Recipe } from '../shared/models/recipe.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  ingredientsForm: FormGroup;
  Object = Object;
  constructor(private _formBuilder: FormBuilder) {
    this.ingredientsForm = this._formBuilder.group({
      cucumber: [2, [Validators.required, Validators.min(0)]],
      olives: [2, [Validators.required, Validators.min(0)]],
      lettuce: [3, [Validators.required, Validators.min(0)]],
      meat: [6, [Validators.required, Validators.min(0)]],
      tomato: [6, [Validators.required, Validators.min(0)]],
      cheese: [8, [Validators.required, Validators.min(0)]],
      dough: [10, [Validators.required, Validators.min(0)]]
    });
  }

  recipes: Recipe[] = [
    { active: true, name: 'Pizza', ingredients: { dough: 3, tomato: 2, cheese: 3, olives: 1 }, feeds: 4 },
    { active: true, name: 'Burger', ingredients: { meat: 1, lettuce: 1, tomato: 1, cheese: 1, dough: 1 }, feeds: 1 },
    { active: true, name: 'Pie', ingredients: { dough: 2, meat: 2 }, feeds: 1 },
    { active: true, name: 'Sandwich', ingredients: { dough: 1, cucumber: 1 }, feeds: 1 },
    { active: true, name: 'Pasta', ingredients: { dough: 2, tomato: 1, cheese: 2, meat: 1 }, feeds: 2 },
    { active: true, name: 'Salad', ingredients: { lettuce: 2, tomato: 2, cucumber: 1, cheese: 2, olives: 1 }, feeds: 3 },

  ];

  optimalCombination: any[] = [];
  totalPeopleFed: null | number = null;

  onSubmit() {
    if (this.ingredientsForm.valid) {
      this.calculateOptimalCombination();
    }
  }
  availableIngredients: any;
  get ingredientControls() {
    return Object.keys(this.ingredientsForm.controls);
  }

  
  calculateOptimalCombination() {
    this.availableIngredients = this.ingredientsForm.getRawValue();

    const combinations: { name: string; count: number; feeds: number; totalFeeds: number; }[] = [];

    let activeRecipes = this.recipes.filter(x => x.active);

    // Calculate feeds per ingredient for each recipe
    activeRecipes.forEach(recipe => {
      const totalIngredients = Object.values(recipe.ingredients).reduce((a, b) => a + b, 0);
      (recipe as any)['feedsPerIngredient'] = recipe.feeds / totalIngredients;
    });

    // Sort recipes by feeds per ingredient ratio in descending order
    activeRecipes.sort((a, b) => (b as any)['feedsPerIngredient'] - (a as any)['feedsPerIngredient']);

    activeRecipes.forEach(recipe => {
      const recipeCount = this.calculateMaxCount(recipe.ingredients);
      if (recipeCount > 0) {
        combinations.push({
          name: recipe.name,
          count: recipeCount,
          feeds: recipe.feeds,
          totalFeeds: recipeCount * recipe.feeds
        });
        this.updateIngredients(recipe.name, recipeCount);
      }
    });

    this.optimalCombination = combinations;
    this.totalPeopleFed = combinations.reduce((acc, combo) => acc + combo.totalFeeds, 0);
  }

  calculateMaxCount(ingredients: any): number {
    return Math.min(
      ...Object.keys(ingredients).map(key =>
        Math.floor((this.availableIngredients as any)[key] / ingredients[key])
      )
    );
  }

  updateIngredients(recipeName: string, count: number) {
    const recipe = this.recipes.find(r => r.name === recipeName);
    if (recipe) {
      Object.keys(recipe.ingredients).forEach(ingredient => {
        // let countIngredients = this.availableIngredients[ingredient];
        this.availableIngredients[ingredient] -= (recipe.ingredients as any)[ingredient] * count;
        // this.ingredientsForm.get(ingredient)?.patchValue(countIngredients);
      });
    }
  }

  toggleRecipe(recipe: Recipe) {
    recipe.active = !recipe.active;
  }
}