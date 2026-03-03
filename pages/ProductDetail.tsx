
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Heart, ShoppingCart, ArrowLeft, Lightbulb, Info, Star, Check, ChevronRight } from 'lucide-react';
import { products } from '../data/products';
import { RootState, addToCart, toggleWishlist, removeFromCart } from '../store';
import { translations } from '../data/translations';
import { getFlowerFunFact } from '../services/geminiService';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current } = useSelector((state: RootState) => state.language);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const t = translations[current];

  const product = products.find(p => p.id === id);
  const isInCart = cartItems.some(item => item.id === id);
  const isInWishlist = wishlistItems.some(item => item.id === id);
  const [funFact, setFunFact] = useState<string | null>(null);
  const [loadingFact, setLoadingFact] = useState(false);

  useEffect(() => {
    if (product) {
      setLoadingFact(true);
      getFlowerFunFact(product.name).then(fact => {
        setFunFact(fact);
        setLoadingFact(false);
      });
      window.scrollTo(0, 0);
    }
  }, [product]);

  if (!product) return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
      <button onClick={() => navigate('/products')} className="text-dark-pink underline">Back to Shop</button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest mb-6 overflow-x-auto no-scrollbar whitespace-nowrap" aria-label="Breadcrumb">
        <Link to="/" className="text-gray-400 hover:text-dark-green transition-colors">Home</Link>
        <ChevronRight size={14} className="text-gray-300" />
        <Link to="/products" className="text-gray-400 hover:text-dark-green transition-colors">{t.products}</Link>
        <ChevronRight size={14} className="text-gray-300" />
        <Link to={`/product/${product.id}`} className="text-dark-pink">{product.name}</Link>
      </nav>

      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center space-x-2 text-dark-green hover:text-dark-pink mb-8 transition-colors group"
        aria-label="Go back to previous page"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold">Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start">
        {/* Left Side - Large Image Gallery */}
        <div className="space-y-6">
          <div className="rounded-3xl overflow-hidden shadow-2xl bg-gray-100 aspect-square">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-dark-pink cursor-pointer opacity-70 hover:opacity-100 transition-all">
                <img src={product.image} alt={`${product.name} view ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Information & Actions */}
        <div className="space-y-8 sticky top-28">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-dark-pink text-sm font-bold uppercase tracking-widest">
              <span>{product.category}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <div className="flex items-center text-yellow-500">
                <Star size={14} fill="currentColor" />
                <span className="ml-1 text-gray-500">4.9 (120 reviews)</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-dark-green tracking-tight">{product.name}</h1>
            <p className="text-3xl font-bold text-dark-pink">{t.rupees}{product.price.toLocaleString()}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-600 font-bold bg-green-50 w-fit px-3 py-1 rounded-full text-sm">
              <Check size={16} />
              <span>In Stock - Delivered Today</span>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg">
              {product.description}
            </p>
          </div>

          {/* Fun Fact Section with AI Badge */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100 relative overflow-hidden group">
            <div className="absolute top-2 right-4 text-[10px] font-bold text-green-700/30 uppercase tracking-widest">Powered by AI</div>
            <div className="flex items-center space-x-3 text-dark-green mb-3 font-bold text-lg">
              <Lightbulb size={22} className="text-yellow-500" />
              <span>{t.fun_fact}</span>
            </div>
            <p className="text-gray-700 italic relative z-10">
              {loadingFact ? (
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </span>
              ) : `"${funFact}"`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => isInCart ? dispatch(removeFromCart(product.id)) : dispatch(addToCart(product))}
              className={`flex-[2] flex items-center justify-center space-x-3 py-5 rounded-2xl font-extrabold text-lg transition-all shadow-lg hover:shadow-xl active:scale-95 ${
                isInCart 
                ? 'bg-red-50 text-red-600 border-2 border-red-200' 
                : 'bg-dark-green text-white hover:bg-hover-green'
              }`}
              aria-label={isInCart ? "Remove from cart" : "Add to cart"}
            >
              <ShoppingCart size={24} />
              <span>{isInCart ? 'Remove from Cart' : t.add_to_cart}</span>
            </button>
            <button
              onClick={() => dispatch(toggleWishlist(product))}
              className={`flex-1 flex items-center justify-center space-x-2 py-5 rounded-2xl border-2 transition-all font-bold active:scale-95 ${
                isInWishlist 
                ? 'border-red-500 bg-red-50 text-red-500 shadow-inner' 
                : 'border-gray-200 text-gray-500 hover:border-dark-pink hover:text-dark-pink'
              }`}
              aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={24} fill={isInWishlist ? "currentColor" : "none"} />
              <span className="sm:hidden lg:inline">{isInWishlist ? 'Saved' : 'Wishlist'}</span>
            </button>
          </div>

          {/* Delivery & Security Badges */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <Info size={16} />
              <span>Free Delivery on ₹1,000+</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <Star size={16} className="text-yellow-400" />
              <span>Satisfaction Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Section (Simple Scroll) */}
      <div className="mt-24">
        <h2 className="text-3xl font-bold text-dark-green mb-12">You might also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.filter(p => p.id !== id).slice(0, 4).map(p => (
            <div key={p.id} className="cursor-pointer group" onClick={() => navigate(`/product/${p.id}`)}>
              <div className="rounded-2xl overflow-hidden aspect-[4/5] mb-4 bg-gray-100 shadow-sm border border-gray-50">
                <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.name} />
              </div>
              <h4 className="font-bold text-dark-green truncate">{p.name}</h4>
              <p className="text-dark-pink font-bold">{t.rupees}{p.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
