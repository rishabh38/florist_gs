
import React, { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { translations } from '../data/translations';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown, SortAsc, HelpCircle, X, SlidersHorizontal } from 'lucide-react';
import { Product } from '../types';

type SortOption = 'featured' | 'price-low' | 'price-high' | 'name-asc';

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

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Fix: Explicitly cast products to Product[] to resolve "unknown" type errors downstream
  const products = useSelector((state: RootState) => state.products.items) as Product[];
  const query = searchParams.get('search')?.toLowerCase() || '';
  const { current } = useSelector((state: RootState) => state.language);
  const t = translations[current];

  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return ['All', ...cats];
  }, [products]);

  const isCloseMatch = (target: string, query: string) => {
    const tStr = target.toLowerCase();
    const qStr = query.toLowerCase();
    if (tStr.includes(qStr)) return true;
    if (qStr.length < 3) return false;
    let matches = 0;
    let queryIdx = 0;
    for (let char of tStr) {
      if (char === qStr[queryIdx]) {
        matches++;
        queryIdx++;
      }
      if (queryIdx === qStr.length) break;
    }
    return matches / qStr.length >= 0.8;
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];
    if (query) {
      result = result.filter(p => 
        isCloseMatch(p.name, query) || 
        isCloseMatch(p.category, query) ||
        isCloseMatch(p.description, query)
      );
    }
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'name-asc': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }
    return result;
  }, [query, selectedCategory, sortBy, products]);

  const suggestions = useMemo(() => {
    if (filteredAndSortedProducts.length > 0 || !query) return [];
    const allNames = Array.from(new Set(products.map(p => p.name)));
    return allNames
      .map(name => ({ name, distance: getEditDistance(query, name.toLowerCase()) }))
      .filter(item => item.distance <= 4)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
      .map(item => item.name);
  }, [filteredAndSortedProducts.length, query, products]);

  const clearSearch = () => setSearchParams({});

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-dark-green mb-2 tracking-tight">{t.products}</h1>
          <p className="text-gray-500 font-medium">Handcrafted arrangements for every occasion.</p>
        </div>
        <div className="flex items-center space-x-3 bg-white px-5 py-2.5 rounded-full border border-gray-100 shadow-sm text-sm">
          <span className="font-black text-dark-pink">{filteredAndSortedProducts.length}</span>
          <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Available</span>
          {query && (
            <div className="flex items-center space-x-2 text-gray-400 border-l border-gray-100 pl-3 ml-1">
              <span className="italic">"{query}"</span>
              <button onClick={clearSearch} className="hover:text-dark-pink transition-colors">
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Prominent Control Bar */}
      <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100 mb-12 flex flex-col xl:flex-row gap-8 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="flex items-center text-dark-green font-black text-[11px] uppercase tracking-[0.2em] mr-2">
            <SlidersHorizontal size={18} className="mr-3 text-dark-pink" />
            <span>Filter</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* Fix: Explicitly typed cat as string to resolve unknown key error */}
            {categories.map((cat: string) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                  selectedCategory === cat 
                  ? 'bg-dark-green text-white shadow-xl scale-105' 
                  : 'bg-gray-50 text-gray-500 hover:bg-pink-50 hover:text-dark-pink'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-5 w-full xl:w-auto border-t xl:border-t-0 pt-6 xl:pt-0">
          <div className="flex items-center text-dark-green font-black text-[11px] uppercase tracking-[0.2em]">
            <SortAsc size={18} className="mr-3 text-dark-pink" />
            <span>Sort By</span>
          </div>
          <div className="relative group flex-1 xl:flex-none xl:min-w-[200px]">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full appearance-none bg-gray-50 border-none rounded-2xl px-5 py-3 pr-10 text-xs font-black uppercase tracking-wider text-dark-green focus:ring-4 focus:ring-dark-pink/10 cursor-pointer outline-none transition-all hover:bg-pink-50"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Alphabetical</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[4rem] shadow-sm border border-dashed border-gray-200">
          <div className="text-7xl mb-8 animate-bounce">🔍</div>
          <h2 className="text-4xl font-black text-dark-green mb-4">No exact matches</h2>
          
          {suggestions.length > 0 && (
            <div className="mt-10 mb-10 p-10 bg-gradient-to-br from-pink-50 to-white rounded-[3rem] max-w-xl mx-auto border border-pink-100 shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
              <div className="flex items-center justify-center space-x-3 text-dark-pink font-black text-xs uppercase tracking-[0.3em] mb-8">
                <HelpCircle size={24} />
                <span>Did you mean?</span>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                {/* Fix: Explicitly typed suggestion as string */}
                {suggestions.map((suggestion: string) => (
                  <button
                    key={suggestion}
                    onClick={() => setSearchParams({ search: suggestion })}
                    className="bg-white px-8 py-3.5 rounded-full text-sm font-black text-dark-green hover:bg-dark-green hover:text-white transition-all shadow-md border border-pink-100 hover:shadow-pink-200 active:scale-95"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-gray-400 max-w-sm mx-auto mb-10 font-bold text-lg leading-relaxed">
            {query 
              ? `We couldn't find flowers matching "${query}". Try one of our suggestions or clear your filters.` 
              : `The ${selectedCategory} category is currently out of stock. Come back tomorrow!`
            }
          </p>
          <button 
            onClick={() => { setSelectedCategory('All'); clearSearch(); }}
            className="bg-dark-green text-white px-12 py-5 rounded-full font-black text-lg hover:bg-hover-green transition-all shadow-2xl hover:shadow-dark-green/30 active:scale-95 flex items-center space-x-3 mx-auto"
          >
            <SlidersHorizontal size={20} />
            <span>Explore All Blooms</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">
          {filteredAndSortedProducts.map((product, idx) => (
            <div 
              key={product.id} 
              className="animate-in fade-in slide-in-from-bottom-4 h-full"
              style={{ animationDelay: `${idx * 75}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

      {/* Newsletter / Seasonal CTA */}
      {filteredAndSortedProducts.length > 0 && !query && selectedCategory === 'All' && (
        <div className="mt-32 p-16 md:p-24 bg-dark-green text-white rounded-[5rem] text-center relative overflow-hidden shadow-2xl border-4 border-dark-pink/10">
          <div className="relative z-10">
            <span className="bg-dark-pink text-[11px] font-black uppercase tracking-[0.4em] px-6 py-2 rounded-full mb-8 inline-block shadow-lg">Flora Club</span>
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">Elevate Every<br/><span className="text-dark-pink">Moment.</span></h2>
            <p className="text-green-100/80 mb-12 max-w-2xl mx-auto text-xl font-medium leading-relaxed">Join 10,000+ flower lovers receiving exclusive early access to seasonal rare blooms and daily care guides.</p>
            <form className="flex flex-col sm:flex-row max-w-lg mx-auto shadow-3xl rounded-3xl overflow-hidden group border-2 border-white/10 p-1 bg-white/5 backdrop-blur-sm">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 p-6 focus:outline-none text-gray-800 font-bold bg-white rounded-2xl sm:rounded-r-none"
                required
              />
              <button type="submit" className="bg-dark-pink text-white px-12 py-6 font-black text-lg hover:bg-hover-pink transition-all sm:rounded-r-2xl">JOIN NOW</button>
            </form>
          </div>
          {/* Decorative Blobs */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-white/5 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-48 -right-48 w-[40rem] h-[40rem] bg-dark-pink/10 rounded-full blur-[120px]"></div>
        </div>
      )}
    </div>
  );
};

export default Products;
