'use client';

import { useState, useEffect } from 'react';
import { Favorite, Recipe } from '@/lib/types';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all favorites on mount
  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (Array.isArray(data)) {
        setFavorites(data);
      } else {
        console.error('Invalid response format:', data);
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      // Set empty array on error to prevent UI crashes
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  // Add a recipe to favorites
  const addFavorite = async (recipe: Recipe) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeId: recipe.idMeal,
          recipeName: recipe.strMeal,
          imageUrl: recipe.strMealThumb,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setFavorites(prev => [data.data, ...prev]);
        return true;
      } else {
        console.error('Failed to add favorite:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
      return false;
    }
  };

  // Remove a recipe from favorites
  const removeFavorite = async (recipeId: string) => {
    try {
      const response = await fetch(`/api/favorites/${recipeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setFavorites(prev => prev.filter(fav => fav.recipeId !== recipeId));
        return true;
      } else {
        console.error('Failed to remove favorite:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
  };

  // Check if recipe is favorited
  const isFavorite = (recipeId: string) => {
    return favorites.some(fav => fav.recipeId === recipeId);
  };

  // Toggle recipe favorite status
  const toggleFavorite = async (recipe: Recipe) => {
    const recipeId = recipe.idMeal;
    
    // Optimistic update - immediately update UI
    const wasAlreadyFavorite = isFavorite(recipeId);
    
    if (wasAlreadyFavorite) {
      // Remove from UI immediately
      setFavorites(prev => prev.filter(fav => fav.recipeId !== recipeId));
    } else {
      // Add to UI immediately
      const newFavorite = {
        recipeId: recipe.idMeal,
        recipeName: recipe.strMeal,
        imageUrl: recipe.strMealThumb,
        createdAt: new Date(),
      };
      setFavorites(prev => [newFavorite, ...prev]);
    }
    
    // Then sync with backend
    let success;
    if (isFavorite(recipeId)) {
      success = await removeFavoriteFromBackend(recipeId);
    } else {
      success = await addFavoriteToBackend(recipe);
    }
    
    // If backend operation failed, revert the optimistic update
    if (!success) {
      if (wasAlreadyFavorite) {
        // Re-add the item
        const favoriteToRestore = {
          recipeId: recipe.idMeal,
          recipeName: recipe.strMeal,
          imageUrl: recipe.strMealThumb,
          createdAt: new Date(),
        };
        setFavorites(prev => [favoriteToRestore, ...prev]);
      } else {
        // Remove the item
        setFavorites(prev => prev.filter(fav => fav.recipeId !== recipeId));
      }
    }
    
    return success;
  };

  // Backend operations (renamed to avoid confusion)
  const addFavoriteToBackend = async (recipe: Recipe) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeId: recipe.idMeal,
          recipeName: recipe.strMeal,
          imageUrl: recipe.strMealThumb,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error adding favorite to backend:', error);
      return false;
    }
  };

  const removeFavoriteFromBackend = async (recipeId: string) => {
    try {
      const response = await fetch(`/api/favorites/${recipeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error removing favorite from backend:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    refetch: fetchFavorites,
  };
}