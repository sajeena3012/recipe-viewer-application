import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema({
  recipeId: {
    type: String,
    required: true,
    unique: true,
  },
  recipeName: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Favorite = mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);

export default Favorite;