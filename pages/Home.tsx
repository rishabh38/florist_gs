
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { products } from '../data/products';
import { translations } from '../data/translations';
import ProductCard from '../components/ProductCard';

const banners = [
  { id: 1, image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=1200', title: 'Monsoon Magic: 20% OFF', subtitle: 'On all Orchid collections' },
  { id: 2, image: 'https://images.unsplash.com/photo-1469248616972-2057371900d8?auto=format&fit=crop&q=80&w=1200', title: 'New Arrivals: Exotic Tulips', subtitle: 'Straight from the fields of Amsterdam' },
  { id: 3, image: 'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?auto=format&fit=crop&q=80&w=1200', title: 'Wedding Specials', subtitle: 'Exclusive bridal bouquets and decor' }
];

const Home: React.FC = () => {
  const { current } = useSelector((state: RootState) => state.language);
  const [activeBanner, setActiveBanner] = useState(0);
  const t = translations[current];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-12">
      {/* Banner */}
      <div className="relative h-[400px] overflow-hidden rounded-xl mx-4 mt-4">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${index === activeBanner ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 text-center text-white px-4">
              <h2 className="text-4xl md:text-6xl font-bold mb-4">{banner.title}</h2>
              <p className="text-xl md:text-2xl opacity-90">{banner.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Best Sellers Scroller */}
      <section className="px-8">
        <h2 className="text-3xl font-bold text-dark-green mb-8">{t.best_sellers}</h2>
        <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide">
          {products.slice(0, 4).map(product => (
            <div key={product.id} className="min-w-[280px] w-1/4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Category Section */}
      <div className="bg-dark-green text-white py-16 px-8 text-center rounded-lg mx-4">
        <h2 className="text-4xl font-bold mb-4">Summer Clearance</h2>
        <p className="text-xl opacity-80 max-w-2xl mx-auto">Get up to 50% off on all Marigold and Daisy arrangements. Limited time offer!</p>
        <button className="mt-8 bg-dark-pink hover:bg-hover-pink text-white px-8 py-3 rounded-full font-bold transition-colors">
          Shop Clearance
        </button>
      </div>

      {/* New Arrivals Scroller */}
      <section className="px-8">
        <h2 className="text-3xl font-bold text-dark-green mb-8">{t.new_arrivals}</h2>
        <div className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide">
          {products.slice(4).map(product => (
            <div key={product.id} className="min-w-[280px] w-1/4">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
