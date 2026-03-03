
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, ShoppingCart, User, Globe, Search, X, Menu, HelpCircle } from 'lucide-react';
import { RootState, setLanguage } from '../store';
import { translations } from '../data/translations';
import { products } from '../data/products';

// Levenshtein distance for fuzzy matching
const getEditDistance = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
      else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[b.length][a.length];
};

const Navbar: React.FC = () => {
  const { current } = useSelector((state: RootState) => state.language);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const t = translations[current];

  const [searchQuery, setSearchQuery] = useState('');
  const [showLangs, setShowLangs] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const suggestions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (q.length < 2) return [];
    
    // If exact matches exist, don't show "Did you mean" in the dropdown for suggestions
    const exactMatches = products.filter(p => p.name.toLowerCase().includes(q));
    if (exactMatches.length > 0) return [];
    
    const allNames = Array.from(new Set(products.map(p => p.name)));
    return allNames
      .map(name => ({ name, distance: getEditDistance(q, name.toLowerCase()) }))
      .filter(item => item.distance <= 3)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 4)
      .map(item => item.name);
  }, [searchQuery]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchVisible(false);
    setShowSuggestions(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangs(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setIsSearchVisible(false);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (name: string) => {
    setSearchQuery(name);
    navigate(`/products?search=${name}`);
    setShowSuggestions(false);
    setIsSearchVisible(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-green text-white shadow-xl h-20 px-4 md:px-8 flex items-center justify-between">
      {/* Brand Logo */}
      <Link 
        to="/" 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="text-2xl font-black tracking-tighter hover:text-dark-pink transition-all flex items-center space-x-1 outline-none focus-visible:ring-2 focus-visible:ring-dark-pink rounded px-1 group"
        aria-label="Florist Home"
      >
        <div className="bg-white text-dark-green p-1.5 rounded-xl mr-1 group-hover:bg-dark-pink group-hover:text-white transition-colors">
          <span className="font-black">FL</span>
        </div>
        <span className="hidden sm:inline">FLORIST</span>
      </Link>

      {/* Central Search Section */}
      <div className="hidden md:flex flex-1 max-w-md mx-8 relative" ref={searchRef}>
        <form onSubmit={handleSearch} className="relative w-full group">
          <input
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            className="w-full py-3 px-6 pr-12 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-dark-pink/30 transition-all border-none bg-white shadow-xl font-medium"
            aria-label="Search flowers"
          />
          <button 
            type="submit" 
            className="absolute right-3 top-2 p-1.5 text-gray-400 hover:text-dark-pink transition-all focus:outline-none hover:scale-110"
            aria-label="Search"
          >
            <Search size={22} />
          </button>
        </form>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-2xl border border-pink-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
            <div className="px-5 py-3 bg-pink-50 flex items-center space-x-2 text-dark-pink text-[10px] font-black uppercase tracking-widest border-b border-pink-100">
              <HelpCircle size={14} />
              <span>Did you mean?</span>
            </div>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => selectSuggestion(suggestion)}
                className="w-full text-left px-6 py-4 text-dark-green hover:bg-pink-50 transition-all font-bold border-b border-gray-50 last:border-none flex items-center justify-between group"
              >
                <span>{suggestion}</span>
                <span className="opacity-0 group-hover:opacity-100 text-dark-pink transition-opacity">→</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Icons & Right Side */}
      <div className="flex items-center space-x-3 md:space-x-5">
        <nav className="hidden lg:flex items-center space-x-6 mr-4" aria-label="Desktop Navigation">
          {['home', 'about', 'products', 'contact'].map((page) => (
            <Link 
              key={page}
              to={page === 'home' ? '/' : `/${page}`} 
              className={`font-bold hover:text-dark-pink transition-colors py-2 relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-pink rounded px-2 ${location.pathname === (page === 'home' ? '/' : `/${page}`) ? 'text-dark-pink' : ''}`}
            >
              {t[page as keyof typeof t]}
              <span className={`absolute bottom-0 left-2 right-2 h-1 bg-dark-pink transition-transform duration-300 rounded-full ${location.pathname === (page === 'home' ? '/' : `/${page}`) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2 md:space-x-4">
          <button 
            onClick={() => setIsSearchVisible(!isSearchVisible)} 
            className="md:hidden p-2.5 hover:bg-white/10 rounded-2xl transition-all focus:outline-none"
            aria-label="Open Search"
          >
            <Search size={22} />
          </button>

          <Link to="/wishlist" className="relative p-2.5 hover:bg-white/10 rounded-2xl transition-all group" aria-label={`Wishlist with ${wishlistCount} items`}>
            <Heart size={24} className={`${wishlistCount > 0 ? 'text-red-500 fill-current' : 'text-white group-hover:text-dark-pink'} transition-all`} />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-dark-pink text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-dark-green font-black animate-in zoom-in">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative p-2.5 hover:bg-white/10 rounded-2xl transition-all group" aria-label={`Cart with ${cartCount} items`}>
            <ShoppingCart size={24} className="text-white group-hover:text-dark-pink transition-all" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-dark-pink text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-dark-green font-black animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </Link>

          <Link to="/profile" className="p-2.5 hover:bg-white/10 rounded-2xl transition-all group" aria-label="My Profile">
            <User size={24} className="text-white group-hover:text-dark-pink transition-all" />
          </Link>

          <div className="relative" ref={langMenuRef}>
            <button 
              onClick={() => setShowLangs(!showLangs)} 
              className={`p-2.5 hover:bg-white/10 rounded-2xl transition-all group ${showLangs ? 'bg-white/20' : ''}`}
              aria-label="Change Language"
              aria-expanded={showLangs}
            >
              <Globe size={24} className="text-white group-hover:text-dark-pink transition-all" />
            </button>
            {showLangs && (
              <div className="absolute right-0 mt-4 bg-white text-dark-green rounded-3xl shadow-2xl py-4 w-44 border border-gray-100 animate-in fade-in slide-in-from-top-2 overflow-hidden z-50">
                <div className="px-5 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-2">Region Settings</div>
                <button onClick={() => { dispatch(setLanguage('en')); setShowLangs(false); }} className={`w-full text-left px-6 py-3 hover:bg-pink-50 hover:text-dark-pink font-bold transition-all ${current === 'en' ? 'bg-pink-50 text-dark-pink' : ''}`}>English</button>
                <button onClick={() => { dispatch(setLanguage('hi')); setShowLangs(false); }} className={`w-full text-left px-6 py-3 hover:bg-pink-50 hover:text-dark-pink font-bold transition-all ${current === 'hi' ? 'bg-pink-50 text-dark-pink' : ''}`}>हिन्दी (Hindi)</button>
                <button onClick={() => { dispatch(setLanguage('gu')); setShowLangs(false); }} className={`w-full text-left px-6 py-3 hover:bg-pink-50 hover:text-dark-pink font-bold transition-all ${current === 'gu' ? 'bg-pink-50 text-dark-pink' : ''}`}>ગુજરાતી (Gujarati)</button>
              </div>
            )}
          </div>

          <button 
            className="lg:hidden p-2.5 hover:bg-white/10 rounded-2xl transition-all"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Experience */}
      {isSearchVisible && (
        <div className="absolute inset-0 bg-dark-green p-4 flex flex-col animate-in slide-in-from-top duration-300 z-[60]">
          <form onSubmit={handleSearch} className="flex items-center bg-white rounded-2xl px-5 py-1 overflow-hidden shadow-2xl">
            <Search size={22} className="text-gray-400" />
            <input 
              autoFocus
              type="text" 
              placeholder={t.search} 
              className="flex-1 p-4 text-gray-900 border-none outline-none font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="button" onClick={() => setIsSearchVisible(false)}>
              <X size={22} className="text-gray-400 hover:text-dark-pink transition-colors" />
            </button>
          </form>
          {suggestions.length > 0 && (
            <div className="mt-4 bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[60vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
               <div className="px-6 py-3 bg-pink-50 flex items-center space-x-2 text-dark-pink text-[10px] font-black uppercase tracking-widest border-b border-pink-100">
                <HelpCircle size={14} />
                <span>Did you mean?</span>
              </div>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => selectSuggestion(suggestion)}
                  className="w-full text-left px-8 py-5 text-dark-green hover:bg-pink-50 transition-all font-black border-b border-gray-50 last:border-none flex items-center justify-between"
                >
                  {suggestion}
                  <span className="text-dark-pink">→</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Responsive Overlay Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-dark-green border-t border-white/10 lg:hidden animate-in slide-in-from-top duration-300 shadow-2xl overflow-hidden rounded-b-[3rem] z-50">
          <nav className="flex flex-col p-8 space-y-4" aria-label="Mobile Navigation">
            {['home', 'about', 'products', 'contact'].map((page) => (
              <Link 
                key={page}
                to={page === 'home' ? '/' : `/${page}`} 
                className="text-2xl font-black p-5 hover:bg-white/10 rounded-3xl flex items-center justify-between group"
              >
                <span>{t[page as keyof typeof t]}</span>
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-dark-pink transition-all">
                  <span className="text-xl">→</span>
                </div>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
