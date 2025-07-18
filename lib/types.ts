export interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions?: string;
  strCategory?: string;
  strArea?: string;
  [key: string]: any;
}

export interface Favorite {
  _id?: string;
  recipeId: string;
  recipeName: string;
  imageUrl: string;
  createdAt?: Date;
}

export interface ApiResponse {
  meals: Recipe[] | null;
}