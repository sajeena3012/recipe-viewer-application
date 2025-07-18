import axios from 'axios';
import { ApiResponse } from './types';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const recipeApi = {
  // Get random recipes
  getRandomRecipes: async (count: number = 8): Promise<ApiResponse['meals']> => {
    try {
      const promises = Array.from({ length: count }, () =>
        axios.get(`${BASE_URL}/random.php`)
      );
      const responses = await Promise.all(promises);
      return responses.map(response => response.data.meals[0]);
    } catch (error) {
      console.error('Error fetching random recipes:', error);
      return null;
    }
  },

  // Get recipe by ID
  getRecipeById: async (id: string): Promise<ApiResponse['meals']> => {
    try {
      const response = await axios.get(`${BASE_URL}/lookup.php?i=${id}`);
      return response.data.meals;
    } catch (error) {
      console.error('Error fetching recipe by ID:', error);
      return null;
    }
  },

  // Search recipes by name
  searchRecipes: async (query: string): Promise<ApiResponse['meals']> => {
    try {
      const response = await axios.get(`${BASE_URL}/search.php?s=${query}`);
      return response.data.meals;
    } catch (error) {
      console.error('Error searching recipes:', error);
      return null;
    }
  },

  // Get recipes by category
  getRecipesByCategory: async (category: string): Promise<ApiResponse['meals']> => {
    try {
      const response = await axios.get(`${BASE_URL}/filter.php?c=${category}`);
      return response.data.meals;
    } catch (error) {
      console.error('Error fetching recipes by category:', error);
      return null;
    }
  },
};