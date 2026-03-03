
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart, Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { addToCart, toggleWishlist, RootState } from '../store';
import { translations } from '../data/translations';
import LazyImage from './LazyImage';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current } = useSelector((state: RootState) => state.language);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isInWishlist = wishlistItems.some(item => item.id === product.id);
  const t = translations[current];

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-[0_20px_50px_rgba(6,78,59,0.15)] hover:scale-[1.02] transition-all duration-500 ease-out hover:-translate-y-2 flex flex-col h-full">
      <div 
        className="relative aspect-square cursor-pointer overflow-hidden bg-gray-50" 
        onClick={() => navigate(`/product/${product.id}`)}
      >
        {/* Lazy Loading Optimization with subtle zoom */}
        <LazyImage 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Overlay Badges */}
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-dark-green shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Action Bar Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex justify-center space-x-3 bg-gradient-to-t from-black/50 to-transparent z-20">
          <button 
            onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
            className="p-3 bg-white text-dark-green rounded-full shadow-xl hover:bg-dark-green hover:text-white transition-all transform hover:scale-110 focus:outline-none"
            aria-label="View product details"
          >
            <Eye size={20} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); dispatch(addToCart(product)); }}
            className="p-3 bg-dark-pink text-white rounded-full shadow-xl hover:bg-white hover:text-dark-pink transition-all transform hover:scale-110 focus:outline-none"
            aria-label="Add to cart"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Favorite Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); dispatch(toggleWishlist(product)); }}
          className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all transform active:scale-90 focus:outline-none z-20 ${
            isInWishlist 
            ? 'bg-red-500 text-white' 
            : 'bg-white/80 backdrop-blur-md text-gray-800 hover:text-red-500'
          }`}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isInWishlist}
        >
          <Heart size={20} fill={isInWishlist ? "white" : "none"} strokeWidth={isInWishlist ? 0 : 2} />
        </button>
      </div>

      <div className="p-6 flex flex-col flex-grow bg-white relative">
        <div className="flex-grow space-y-2 cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-dark-green leading-tight line-clamp-2 hover:text-dark-pink transition-colors">
              {product.name}
            </h3>
          </div>
          <p className="text-gray-400 text-sm line-clamp-1">{product.description}</p>
        </div>
        
        <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
          <p className="text-2xl font-black text-dark-pink">
            <span className="text-sm font-bold align-top mr-0.5">{t.rupees}</span>
            {product.price.toLocaleString()}
          </p>
          <button 
            onClick={() => dispatch(addToCart(product))}
            className="bg-gray-100 text-dark-green p-2.5 rounded-xl hover:bg-dark-green hover:text-white transition-all focus:outline-none"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
