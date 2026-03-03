
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { RootState } from '../store';
import { translations } from '../data/translations';
import ProductCard from '../components/ProductCard';

const Wishlist: React.FC = () => {
  const { current } = useSelector((state: RootState) => state.language);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const t = translations[current];

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto pt-40 px-8 text-center">
        <Heart size={80} className="mx-auto text-gray-200 mb-6" />
        <h2 className="text-3xl font-bold text-dark-green mb-4">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-8">Save your favorite blooms for later!</p>
        <Link to="/products" className="bg-dark-green text-white px-8 py-3 rounded-full font-bold hover:bg-hover-green">
          Explore Flowers
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 pt-24">
      <h1 className="text-4xl font-bold text-dark-green mb-12">{t.wishlist}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {wishlistItems.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
