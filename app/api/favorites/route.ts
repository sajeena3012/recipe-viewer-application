import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Favorite from '@/models/Favorite';

// In-memory storage for fallback mode
let fallbackFavorites: any[] = [];

export async function GET() {
  try {
    const connection = await dbConnect();
    
    // Check if we're in fallback mode
    if (connection?.fallback) {
      console.log('Using fallback storage for GET favorites');
      return NextResponse.json(fallbackFavorites);
    }
    
    const favorites = await Favorite.find().sort({ createdAt: -1 });
    return NextResponse.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    // Always return a valid response, never throw
    return NextResponse.json(fallbackFavorites);
  }
}

export async function POST(request: NextRequest) {
  try {
    const connection = await dbConnect();
    const body = await request.json();
    const { recipeId, recipeName, imageUrl } = body;
    
    // Validate required fields
    if (!recipeId || !recipeName || !imageUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if we're in fallback mode
    if (connection?.fallback) {
      console.log('Using fallback storage for POST favorite');
      
      // Check if already exists in fallback storage
      const existingFavorite = fallbackFavorites.find(fav => fav.recipeId === recipeId);
      if (existingFavorite) {
        return NextResponse.json(
          { success: false, error: 'Recipe already in favorites' },
          { status: 409 }
        );
      }
      
      // Add to fallback storage
      const newFavorite = {
        _id: Date.now().toString(),
        recipeId,
        recipeName,
        imageUrl,
        createdAt: new Date(),
      };
      
      fallbackFavorites.unshift(newFavorite);
      return NextResponse.json({ success: true, data: newFavorite }, { status: 201 });
    }
    
    const existingFavorite = await Favorite.findOne({ recipeId });
    if (existingFavorite) {
      return NextResponse.json(
        { success: false, error: 'Recipe already in favorites' },
        { status: 409 }
      );
    }

    const favorite = await Favorite.create({
      recipeId,
      recipeName,
      imageUrl,
    });

    return NextResponse.json({ success: true, data: favorite }, { status: 201 });
  } catch (error) {
    console.error('Error adding favorite:', error);
    // Always return a valid response, never throw
    return NextResponse.json(
      { success: false, error: 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const connection = await dbConnect();
    const body = await request.json();
    const { recipeId } = body;
    
    if (!recipeId) {
      return NextResponse.json(
        { success: false, error: 'Recipe ID is required' },
        { status: 400 }
      );
    }
    
    // Check if we're in fallback mode
    if (connection?.fallback) {
      console.log('Using fallback storage for DELETE favorite');
      
      const favoriteIndex = fallbackFavorites.findIndex(fav => fav.recipeId === recipeId);
      if (favoriteIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Favorite not found' },
          { status: 404 }
        );
      }
      
      const deletedFavorite = fallbackFavorites.splice(favoriteIndex, 1)[0];
      return NextResponse.json({ success: true, data: deletedFavorite });
    }
    
    const deletedFavorite = await Favorite.findOneAndDelete({ recipeId });
    
    if (!deletedFavorite) {
      return NextResponse.json(
        { success: false, error: 'Favorite not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deletedFavorite });
  } catch (error) {
    console.error('Error removing favorite:', error);
    // Always return a valid response, never throw
    return NextResponse.json(
      { success: false, error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}