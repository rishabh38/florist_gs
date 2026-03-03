
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { RootState, removeFromCart, updateQuantity } from '../store';
import { translations } from '../data/translations';

const Cart: React.FC = () => {
  const { current } = useSelector((state: RootState) => state.language);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = translations[current];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 1000 ? 0 : 99;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto pt-40 px-8 text-center">
        <ShoppingBag size={80} className="mx-auto text-gray-200 mb-6" />
        <h2 className="text-3xl font-bold text-dark-green mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="bg-dark-green text-white px-8 py-3 rounded-full font-bold hover:bg-hover-green">
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 pt-24 pb-12">
      <h1 className="text-4xl font-bold text-dark-green mb-12">{t.cart}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Item List */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
              <div className="ml-6 flex-1">
                <h3 className="text-lg font-bold text-dark-green">{item.name}</h3>
                <p className="text-dark-pink font-semibold">{t.rupees}{item.price}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-lg bg-gray-50">
                  <button 
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                    className="p-2 hover:text-dark-pink"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                  <button 
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                    className="p-2 hover:text-dark-pink"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button 
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 h-fit space-y-6">
          <h2 className="text-2xl font-bold text-dark-green">Summary</h2>
          <div className="space-y-4 border-b pb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{t.rupees}{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `${t.rupees}${shipping}`}</span>
            </div>
          </div>
          <div className="flex justify-between text-xl font-bold text-dark-green">
            <span>Total</span>
            <span>{t.rupees}{(subtotal + shipping).toLocaleString()}</span>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-dark-pink hover:bg-hover-pink text-white py-4 rounded-full font-bold transition-colors"
          >
            {t.checkout}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
