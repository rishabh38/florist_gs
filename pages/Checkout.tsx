
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, clearCart, addOrder } from '../store';
import { translations } from '../data/translations';
import { Order } from '../types';

const Checkout: React.FC = () => {
  const { current } = useSelector((state: RootState) => state.language);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = translations[current];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const [form, setForm] = useState({ 
    fullName: '', 
    email: '', 
    address: '', 
    city: '', 
    pin: '', 
    phone: '' 
  });
  const [errors, setErrors] = useState<any>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const validate = () => {
    let e: any = {};
    if (!form.fullName) e.fullName = 'Required';
    if (!form.email.includes('@')) e.email = 'Invalid email';
    if (!form.address) e.address = 'Required';
    if (!form.city) e.city = 'Required';
    if (!form.pin.match(/^\d{6}$/)) e.pin = '6-digit PIN required';
    if (!form.phone.match(/^\d{10}$/)) e.phone = '10-digit phone required';
    return e;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const valErrors = validate();
    if (Object.keys(valErrors).length === 0) {
      setIsProcessing(true);
      setTimeout(() => {
        const orderId = "FL-" + Math.floor(Math.random() * 999999);
        
        const newOrder: Order = {
          id: orderId,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          items: [...cartItems],
          total: subtotal,
          status: 'Processing'
        };

        dispatch(addOrder(newOrder));
        dispatch(clearCart());
        
        alert("Order placed successfully! Transaction ID: " + orderId);
        navigate('/profile');
      }, 2000);
    } else {
      setErrors(valErrors);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 pt-24 pb-12">
      <h1 className="text-4xl font-bold text-dark-green mb-12">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <form onSubmit={handlePlaceOrder} className="space-y-6">
          <h2 className="text-2xl font-bold text-dark-pink">Shipping Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold mb-1">Full Name</label>
              <input type="text" value={form.fullName} onChange={(e) => setForm({...form, fullName: e.target.value})} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-dark-pink/20 outline-none" />
              {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-dark-pink/20 outline-none" />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-dark-pink/20 outline-none" />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold mb-1">Shipping Address</label>
              <textarea value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-dark-pink/20 outline-none" rows={3} />
              {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">City</label>
              <input type="text" value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-dark-pink/20 outline-none" />
              {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">PIN Code</label>
              <input type="text" value={form.pin} onChange={(e) => setForm({...form, pin: e.target.value})} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-dark-pink/20 outline-none" />
              {errors.pin && <p className="text-red-500 text-xs">{errors.pin}</p>}
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isProcessing}
            className="w-full bg-dark-green text-white py-4 rounded-full font-bold hover:bg-hover-green transition-all shadow-lg active:scale-95"
          >
            {isProcessing ? 'Processing Payment...' : `Confirm & Pay ${t.rupees}${subtotal.toLocaleString()}`}
          </button>
        </form>

        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-dark-green">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
                <div className="flex items-center space-x-4">
                  <img src={item.image} className="w-12 h-12 object-cover rounded-lg shadow-sm" alt="" />
                  <div>
                    <p className="font-bold text-dark-green">{item.name}</p>
                    <p className="text-xs text-gray-500 font-medium">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-bold text-dark-pink">{t.rupees}{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between font-medium text-gray-600">
              <span>Subtotal</span>
              <span>{t.rupees}{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-black text-2xl text-dark-green pt-2">
              <span>Total Amount</span>
              <span>{t.rupees}{subtotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
