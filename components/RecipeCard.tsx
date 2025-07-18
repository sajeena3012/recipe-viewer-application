'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Recipe } from '@/lib/types';
import { Heart } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite?: boolean;
  onFavoriteToggle?: (recipe: Recipe) => void;
  showFavoriteButton?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isFavorite = false,
  onFavoriteToggle,
  showFavoriteButton = false,
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle?.(recipe);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform hover:scale-105">
      <Link href={`/recipe/${recipe.idMeal}`}>
        <div className="relative">
          <Image
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            width={300}
            height={200}
            className="w-full h-48 object-cover"
            unoptimized
          />
          {showFavoriteButton && (
            <button
              onClick={handleFavoriteClick}
              className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                isFavorite
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart 
                size={20} 
                fill={isFavorite ? "currentColor" : "none"}
                className="transition-all duration-200"
              />
            </button>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {recipe.strMeal}
          </h3>
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            {recipe.strCategory && (
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                {recipe.strCategory}
              </span>
            )}
            {recipe.strArea && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {recipe.strArea}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};