'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowLeft, Heart, Clock, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Recipe } from '@/lib/types';
import { useFavorites } from '@/hooks/useFavorites';

interface RecipeDetailClientProps {
  recipe: Recipe;
}

export const RecipeDetailClient: React.FC<RecipeDetailClientProps> = ({ recipe }) => {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();

  const getIngredients = () => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure ? measure.trim() + ' ' : ''}${ingredient.trim()}`);
      }
    }
    return ingredients;
  };

  const handleFavoriteToggle = () => {
    toggleFavorite(recipe);
  };

  const isRecipeFavorite = isFavorite(recipe.idMeal);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to recipes
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-64 md:h-80">
          <Image
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {recipe.strMeal}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {recipe.strCategory && (
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                      {recipe.strCategory}
                    </span>
                  )}
                  {recipe.strArea && (
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                      {recipe.strArea}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={handleFavoriteToggle}
                className={`p-3 rounded-full transition-colors ${
                  isRecipeFavorite
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
                }`}
                title={isRecipeFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart 
                  size={24} 
                  fill={isRecipeFavorite ? "currentColor" : "none"}
                  className="transition-all duration-200"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Ingredients
              </h2>
              <ul className="space-y-2">
                {getIngredients().map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Instructions
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {recipe.strInstructions}
                </p>
              </div>
            </div>
          </div>

          {recipe.strYoutube && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Video Tutorial
              </h3>
              <a
                href={recipe.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Watch on YouTube
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};