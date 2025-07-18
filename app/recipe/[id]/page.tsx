import React from 'react';
import { notFound } from 'next/navigation';
import { RecipeDetailClient } from '@/components/RecipeDetailClient';
import { recipeApi } from '@/lib/api';

interface RecipeDetailPageProps {
  params: { id: string };
}

export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const recipes = await recipeApi.getRecipeById(params.id);
  
  if (!recipes || recipes.length === 0) {
    notFound();
  }

  const recipe = recipes[0];
  
  return <RecipeDetailClient recipe={recipe} />;
}