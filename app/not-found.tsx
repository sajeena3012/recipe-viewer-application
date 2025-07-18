import React from 'react';
import Link from 'next/link';
import { ChefHat } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Recipe Not Found</h1>
        <p className="text-gray-600 mb-6">
          The recipe you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/"
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}