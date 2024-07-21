import { Ingredients } from "./ingredient.model";

export interface Recipe {
    active: boolean;
    name: string;
    ingredients: Ingredients;
    feeds: number;
    feedsPerIngredient?: number;
}