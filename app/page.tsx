'use client';

import React, { useState, useEffect } from 'react';
import { RecipeCard } from '@/components/RecipeCard';
import { SearchBar } from '@/components/SearchBar';
import { LoadingGrid } from '@/components/ui/loading';
import { useFavorites } from '@/hooks/useFavorites';
import { recipeApi } from '@/lib/api';
import { Recipe } from '@/lib/types';
import { Shuffle } from 'lucide-react';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { isFavorite, toggleFavorite } = useFavorites();

  const fetchRecipes = async (query?: string) => {
    setLoading(true);
    try {
      let data;
      if (query) {
        data = await recipeApi.searchRecipes(query);
      } else {
        data = await recipeApi.getRandomRecipes(12);
      }
      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchRecipes(query);
  };

  const handleRandomRecipes = () => {
    setSearchQuery('');
    fetchRecipes();
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Discover Amazing Recipes
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Explore thousands of delicious recipes from around the world
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <SearchBar onSearch={handleSearch} />
          <button
            onClick={handleRandomRecipes}
            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            <Shuffle className="w-5 h-5" />
            Random Recipes
          </button>
        </div>
      </div>

      {searchQuery && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Search results for "{searchQuery}"
          </h2>
          <p className="text-gray-600">{recipes.length} recipes found</p>
        </div>
      )}

      {loading ? (
        <LoadingGrid />
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.idMeal}
              recipe={recipe}
              isFavorite={isFavorite(recipe.idMeal)}
              onFavoriteToggle={toggleFavorite}
              showFavoriteButton={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">
            {searchQuery ? 'No recipes found for your search.' : 'No recipes available.'}
          </p>
          <button
            onClick={handleRandomRecipes}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Try Random Recipes
          </button>
        </div>
      )}
    </div>
  );
}