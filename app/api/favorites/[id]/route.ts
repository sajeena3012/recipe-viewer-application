import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Favorite from '@/models/Favorite';

// Fallback storage for when database connection fails
let fallbackFavorites: any[] = [];

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to database
    const connection = await dbConnect();
    const { id } = params;

    // Validate recipe ID
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Recipe ID is required' },
        { status: 400 }
      );
    }

    // Fallback mode handling
    if (connection?.fallback) {
      console.log('Using fallback storage for DELETE favorite by ID');
      
      const favoriteIndex = fallbackFavorites.findIndex(fav => fav.recipeId === id);
      if (favoriteIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Favorite not found' },
          { status: 404 }
        );
      }
      
      const deletedFavorite = fallbackFavorites.splice(favoriteIndex, 1)[0];
      return NextResponse.json({ success: true, data: deletedFavorite });
    }

    // Normal database operation
    const deletedFavorite = await Favorite.findOneAndDelete({ recipeId: id });
    
    if (!deletedFavorite) {
      return NextResponse.json(
        { success: false, error: 'Favorite not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: deletedFavorite 
    });
    
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}