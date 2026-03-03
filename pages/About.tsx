
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-8 pt-24 space-y-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-5xl font-bold text-dark-green mb-8">Our Floral Story</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Founded in 1998 in the heart of Mumbai, Florist began as a small boutique stall with a single vision: to bring the freshest, most vibrant blooms from Indian hillsides directly to your door.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Today, we are India's leading premium florist, partnering with over 50 exclusive farms across the country. Our florists are artisans who don't just arrange flowers; they compose stories of love, celebration, and remembrance.
          </p>
        </div>
        <div className="rounded-3xl overflow-hidden shadow-2xl h-[450px]">
          <img src="https://images.unsplash.com/photo-1517260911058-0fcfd733c021?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Florist workshop" />
        </div>
      </div>

      <div className="bg-dark-green text-white p-12 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="text-center">
          <h3 className="text-4xl font-bold mb-4">Farm Fresh</h3>
          <p className="opacity-80">We bypass the middleman, ensuring flowers reach you within 24 hours of being picked.</p>
        </div>
        <div className="text-center">
          <h3 className="text-4xl font-bold mb-4">Eco Friendly</h3>
          <p className="opacity-80">Our packaging is 100% biodegradable, and we use zero plastic in our bouquets.</p>
        </div>
        <div className="text-center">
          <h3 className="text-4xl font-bold mb-4">Expert Craft</h3>
          <p className="opacity-80">Every bouquet is hand-tied by certified master florists with over 10 years of experience.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
