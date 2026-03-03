
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store';
import { translations } from '../data/translations';

const Footer: React.FC = () => {
  const { current } = useSelector((state: RootState) => state.language);
  const t = translations[current];

  return (
    <footer className="bg-dark-pink text-white pt-12 pb-6 px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-pink-400 pb-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">FLORIST</h3>
          <p className="text-sm opacity-90">
            Crafting memories with every petal. Your destination for premium floral arrangements in India since 1998.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-dark-green transition-colors">{t.home}</Link></li>
            <li><Link to="/about" className="hover:text-dark-green transition-colors">{t.about}</Link></li>
            <li><Link to="/products" className="hover:text-dark-green transition-colors">{t.products}</Link></li>
            <li><Link to="/contact" className="hover:text-dark-green transition-colors">{t.contact}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-lg">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/wishlist" className="hover:text-dark-green transition-colors">{t.wishlist}</Link></li>
            <li><Link to="/cart" className="hover:text-dark-green transition-colors">{t.cart}</Link></li>
            <li className="hover:text-dark-green cursor-pointer">Privacy Policy</li>
            <li className="hover:text-dark-green cursor-pointer">Shipping & Returns</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-lg">Contact Us</h4>
          <p className="text-sm opacity-90">123 Flower Valley, MG Road</p>
          <p className="text-sm opacity-90">Mumbai, Maharashtra - 400001</p>
          <p className="text-sm opacity-90 mt-2">Email: hello@florist.co.in</p>
          <p className="text-sm opacity-90">Call: +91 98765 43210</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto text-center text-xs opacity-75">
        <p>© {new Date().getFullYear()} Florist Floral Private Limited. Incorporated under the Companies Act, 2013 (CIN: U12345MH2013PTC123456).</p>
      </div>
    </footer>
  );
};

export default Footer;
