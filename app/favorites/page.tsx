'use client';

import React, { useState } from 'react';
import { RecipeCard } from '@/components/RecipeCard';
import { LoadingGrid } from '@/components/ui/loading';
import { useFavorites } from '@/hooks/useFavorites';
import { Heart, Trash2 } from 'lucide-react';
import { toast } from 'sonner'; // or your preferred toast notification library

export default function FavoritesPage() {
  const { favorites, loading, removeFavorite, refetch } = useFavorites();
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  const handleRemoveFavorite = async (recipeId: string) => {
    try {
      // Add to removing set to disable the button and show loading
      setRemovingIds(prev => new Set(prev).add(recipeId));
      
      // Call the removeFavorite function from your hook
      const success = await removeFavorite(recipeId);
      
      if (!success) {
        throw new Error('Failed to remove favorite');
      }
      
      // Optional: show success message
      toast.success('Recipe removed from favorites');
      
      // Optional: refetch to ensure sync with backend
      await refetch();
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove recipe from favorites');
    } finally {
      // Remove from removing set
      setRemovingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(recipeId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Favorite Recipes</h1>
        <LoadingGrid />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-8 h-8 text-red-500" />
        <h1 className="text-3xl font-bold text-gray-800">My Favorite Recipes</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">
            No favorites yet
          </h2>
          <p className="text-gray-500 mb-6">
            Start exploring recipes and add them to your favorites!
          </p>
          <a
            href="/"
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Browse Recipes
          </a>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-6">
            You have {favorites.length} favorite recipe{favorites.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((favorite) => (
              <div key={favorite.recipeId} className="relative group">
                <RecipeCard
                  recipe={{
                    idMeal: favorite.recipeId,
                    strMeal: favorite.recipeName,
                    strMealThumb: favorite.imageUrl,
                  }}
                />
                <button
                  onClick={() => handleRemoveFavorite(favorite.recipeId)}
                  disabled={removingIds.has(favorite.recipeId)}
                  className={`absolute top-2 right-2 p-2 rounded-full transition-opacity ${
                    removingIds.has(favorite.recipeId)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-600'
                  }`}
                  title="Remove from favorites"
                >
                  {removingIds.has(favorite.recipeId) ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent" />
                  ) : (
                    <Trash2 size={16} className="text-white" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}