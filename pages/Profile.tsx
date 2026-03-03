
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, login, logout, updateProduct, deleteProduct, addProduct, resetInventory, reorderItems } from '../store';
import { translations } from '../data/translations';
import { Edit2, Save, Trash2, ShieldCheck, ShoppingBag, Plus, X, Image as ImageIcon, RotateCcw, Package, Calendar, ChevronRight, RefreshCcw } from 'lucide-react';
import { Product, Order } from '../types';

const Profile: React.FC = () => {
  const { current } = useSelector((state: RootState) => state.language);
  const user = useSelector((state: RootState) => state.auth.user);
  const products = useSelector((state: RootState) => state.products.items);
  const orders = useSelector((state: RootState) => state.orders.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = translations[current];

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Form state for adding/editing
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    category: '',
    image: 'https://images.unsplash.com/photo-1548610372-2838bd99099f?auto=format&fit=crop&q=80&w=800'
  });

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const isAdmin = formData.email === 'admin@florist.com';
      dispatch(login({ 
        name: isAdmin ? 'Inventory Manager' : formData.email.split('@')[0], 
        email: formData.email, 
        phone: '9876543210', 
        isLoggedIn: true 
      }));
    } else {
      dispatch(login({ name: formData.name, email: formData.email, phone: formData.phone, isLoggedIn: true }));
    }
  };

  const handleReorder = (order: Order) => {
    dispatch(reorderItems(order.items));
    navigate('/cart');
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setProductForm(product);
  };

  const openAdd = () => {
    setIsAddingProduct(true);
    setProductForm({
      name: '',
      price: 0,
      description: '',
      category: '',
      image: 'https://images.unsplash.com/photo-1548610372-2838bd99099f?auto=format&fit=crop&q=80&w=800'
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      dispatch(updateProduct({ ...editingProduct, ...productForm } as Product));
      setEditingProduct(null);
    } else if (isAddingProduct) {
      const newProduct: Product = {
        ...productForm as Product,
        id: Date.now().toString(),
      };
      dispatch(addProduct(newProduct));
      setIsAddingProduct(false);
    }
  };

  if (user?.isLoggedIn) {
    const isAdmin = user.email === 'admin@florist.com';

    return (
      <div className="max-w-6xl mx-auto pt-24 px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* User Profile Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-50">
              <div className="bg-dark-green h-40 relative flex items-end justify-center">
                <div className="absolute -bottom-16 w-32 h-32 bg-dark-pink rounded-[2rem] border-8 border-white shadow-xl flex items-center justify-center text-white text-5xl font-black transform rotate-6 hover:rotate-0 transition-transform duration-500">
                  {user.name[0].toUpperCase()}
                </div>
              </div>
              <div className="pt-20 px-10 pb-10 text-center space-y-6">
                <div>
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <h1 className="text-3xl font-black text-dark-green line-clamp-1">{user.name}</h1>
                    {isAdmin && <ShieldCheck className="text-dark-pink shrink-0" size={24} />}
                  </div>
                  <p className="text-gray-400 font-bold">{user.email}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 group hover:bg-white hover:shadow-lg transition-all">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Mobile</p>
                    <p className="font-bold text-dark-green text-sm">+91 {user.phone}</p>
                  </div>
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 group hover:bg-white hover:shadow-lg transition-all">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Status</p>
                    <p className="font-bold text-dark-pink text-sm uppercase">{isAdmin ? 'Admin' : 'Member'}</p>
                  </div>
                </div>

                <button 
                  onClick={() => dispatch(logout())}
                  className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all active:scale-95 shadow-sm"
                >
                  {t.logout}
                </button>
              </div>
            </div>

            {isAdmin && (
              <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <RotateCcw className="text-dark-pink" size={20} />
                    <h3 className="text-xl font-black tracking-tight">System Controls</h3>
                  </div>
                  <p className="opacity-70 font-bold text-xs mb-6 leading-relaxed">Reset all modifications to return to the original store catalog. This action cannot be undone.</p>
                  <button 
                    onClick={() => { if(confirm('Reset all inventory changes?')) dispatch(resetInventory()); }}
                    className="w-full bg-dark-pink/20 text-dark-pink border border-dark-pink/30 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-dark-pink hover:text-white transition-all shadow-lg"
                  >
                    Reset Inventory
                  </button>
                </div>
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-dark-pink/5 rounded-full blur-2xl group-hover:bg-dark-pink/10 transition-colors"></div>
              </div>
            )}
          </div>

          {/* User History or Admin Inventory */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-2xl border border-gray-100">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
                <div>
                  <h2 className="text-4xl font-black text-dark-green tracking-tight">
                    {isAdmin ? 'Store Inventory' : 'Order History'}
                  </h2>
                  <p className="text-gray-400 font-bold mt-1">
                    {isAdmin ? 'Manage flower listings' : 'Your past blooming moments'}
                  </p>
                </div>
                {isAdmin && (
                   <button 
                    onClick={openAdd}
                    className="bg-dark-green text-white px-6 py-3 rounded-2xl shadow-xl flex items-center space-x-2 font-black uppercase tracking-widest text-xs hover:bg-dark-pink transition-all hover:scale-105"
                   >
                    <Plus size={20} />
                    <span>New Product</span>
                   </button>
                )}
              </div>

              {isAdmin ? (
                <div className="grid grid-cols-1 gap-4">
                  {products.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                      <p className="text-gray-400 font-black uppercase tracking-[0.2em]">Inventory is empty</p>
                    </div>
                  ) : (
                    products.map(p => (
                      <div key={p.id} className="group p-4 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center space-x-4">
                          <img src={p.image} className="w-16 h-16 object-cover rounded-2xl shadow-md border-2 border-white" alt="" />
                          <div>
                            <h4 className="font-black text-dark-green text-base line-clamp-1">{p.name}</h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-dark-pink font-bold text-sm">₹{p.price}</span>
                              <span className="text-gray-300 text-[10px] uppercase font-black tracking-widest">• {p.category}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => openEdit(p)}
                            className="p-3 bg-white text-gray-400 rounded-xl hover:text-dark-green hover:bg-dark-green/5 transition-all shadow-sm group-hover:shadow-md"
                            title="Edit Product"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => { if(confirm('Permanently delete this product?')) dispatch(deleteProduct(p.id)); }}
                            className="p-3 bg-white text-gray-400 rounded-xl hover:text-red-500 hover:bg-red-50 transition-all shadow-sm group-hover:shadow-md"
                            title="Delete Product"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-20 opacity-40">
                      <ShoppingBag size={80} className="mx-auto mb-6" />
                      <p className="text-xl font-black text-dark-green uppercase tracking-widest">No orders yet</p>
                      <p className="font-bold text-gray-400 mt-2">Start your first blooming story today!</p>
                      <button onClick={() => navigate('/products')} className="mt-8 bg-dark-pink text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-xl">Shop Now</button>
                    </div>
                  ) : (
                    orders.map(order => (
                      <div key={order.id} className="bg-gray-50 border border-gray-100 rounded-[2rem] overflow-hidden hover:shadow-xl transition-all group">
                        <div className="p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white border-b border-gray-100">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-dark-pink">
                              <Package size={24} />
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</p>
                              <p className="font-black text-dark-green">{order.id}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-8">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Date</p>
                              <div className="flex items-center text-dark-green font-bold text-sm">
                                <Calendar size={14} className="mr-1 opacity-50" />
                                {order.date}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total</p>
                              <p className="text-dark-pink font-black text-lg">₹{order.total.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-6 flex items-center justify-between">
                          <div className="flex -space-x-3 overflow-hidden">
                            {order.items.slice(0, 4).map((item, idx) => (
                              <img key={idx} src={item.image} className="inline-block h-10 w-10 rounded-full ring-4 ring-gray-50 object-cover" alt={item.name} title={item.name} />
                            ))}
                            {order.items.length > 4 && (
                              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-dark-green text-[10px] font-black text-white ring-4 ring-gray-50">
                                +{order.items.length - 4}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={() => setSelectedOrder(order)}
                              className="px-5 py-2.5 bg-white border border-gray-200 text-dark-green rounded-xl font-black uppercase tracking-widest text-[10px] hover:border-dark-green transition-colors flex items-center space-x-2"
                            >
                              <span>Details</span>
                              <ChevronRight size={14} />
                            </button>
                            <button 
                              onClick={() => handleReorder(order)}
                              className="px-5 py-2.5 bg-dark-green text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-dark-pink transition-all flex items-center space-x-2 shadow-lg hover:shadow-pink-100"
                            >
                              <RefreshCcw size={14} />
                              <span>Reorder</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] bg-dark-green/60 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="bg-white rounded-[3rem] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in duration-300">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-dark-green tracking-tight">Order Details</h3>
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">Ref: {selectedOrder.id}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-3 hover:bg-red-50 rounded-2xl text-red-400 transition-colors"><X size={24} /></button>
              </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center space-x-4">
                      <img src={item.image} className="w-12 h-12 object-cover rounded-xl" alt="" />
                      <div>
                        <p className="font-bold text-dark-green text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500 font-medium">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-black text-dark-pink text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                <div className="flex justify-between items-center px-2">
                  <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Status</span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedOrder.status}</span>
                </div>
                <div className="flex justify-between items-center px-2">
                  <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Total Amount</span>
                  <span className="text-dark-green text-xl font-black">₹{selectedOrder.total.toLocaleString()}</span>
                </div>
                
                <button 
                  onClick={() => handleReorder(selectedOrder)}
                  className="w-full bg-dark-pink text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-dark-green transition-all shadow-xl active:scale-95 flex items-center justify-center space-x-3 mt-4"
                >
                  <RefreshCcw size={16} />
                  <span>Reorder All Items</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global CRUD Modal */}
        {(editingProduct || isAddingProduct) && (
          <div className="fixed inset-0 z-[100] bg-dark-green/60 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-[3.5rem] w-full max-w-2xl p-8 md:p-12 shadow-[0_0_100px_rgba(0,0,0,0.3)] animate-in zoom-in duration-300 my-auto">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-3xl font-black text-dark-green tracking-tight">
                    {isAddingProduct ? 'Add New Bouquet' : 'Edit Bouquet Details'}
                  </h3>
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">
                    {isAddingProduct ? 'Create a new entry in your catalog' : `Updating SKU: ${editingProduct?.id}`}
                  </p>
                </div>
                <button onClick={() => { setEditingProduct(null); setIsAddingProduct(false); }} className="p-3 hover:bg-red-50 rounded-2xl text-red-400 transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Product Name</label>
                      <input 
                        type="text" 
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-dark-pink/10 font-bold text-dark-green outline-none"
                        placeholder="e.g., Midnight Roses"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Price (₹)</label>
                        <input 
                          type="number" 
                          required
                          value={productForm.price}
                          onChange={(e) => setProductForm({...productForm, price: Number(e.target.value)})}
                          className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-dark-pink/10 font-bold text-dark-green outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Category</label>
                        <input 
                          type="text" 
                          required
                          value={productForm.category}
                          onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                          className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-dark-pink/10 font-bold text-dark-green outline-none"
                          placeholder="e.g., Roses"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Image URL</label>
                      <div className="relative">
                        <input 
                          type="url" 
                          required
                          value={productForm.image}
                          onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                          className="w-full p-4 pr-12 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-dark-pink/10 font-bold text-dark-green outline-none"
                          placeholder="https://..."
                        />
                        <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1">Live Preview</label>
                     <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border-4 border-white shadow-xl flex items-center justify-center">
                        {productForm.image ? (
                           <img src={productForm.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1548610372-2838bd99099f?auto=format&fit=crop&q=80&w=800')} />
                        ) : (
                          <div className="text-gray-300 text-sm font-bold uppercase tracking-widest">No Image</div>
                        )}
                     </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Public Description</label>
                  <textarea 
                    rows={3}
                    required
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    className="w-full p-5 bg-gray-50 border-none rounded-3xl focus:ring-4 focus:ring-dark-pink/10 font-bold text-dark-green outline-none resize-none leading-relaxed"
                    placeholder="Tell the story of these flowers..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                  <button type="submit" className="flex-1 bg-dark-green text-white py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:bg-dark-pink hover:shadow-pink-200 transition-all flex items-center justify-center space-x-3">
                    <Save size={22} />
                    <span>{isAddingProduct ? 'Create Listing' : 'Update Catalog'}</span>
                  </button>
                  {!isAddingProduct && (
                    <button 
                      type="button" 
                      onClick={() => { if(confirm('Delete product?')) { dispatch(deleteProduct(editingProduct!.id)); setEditingProduct(null); } }} 
                      className="bg-red-50 text-red-500 px-8 rounded-[2rem] hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      title="Delete Listing"
                    >
                      <Trash2 size={24} />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto pt-32 px-4 pb-20">
      <div className="bg-white p-10 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-50 space-y-8 animate-in slide-in-from-bottom-10 duration-700">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black text-dark-green tracking-tight">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">{isLogin ? 'Sign in to continue' : 'Join our blooming community'}</p>
        </div>
        
        <form onSubmit={handleAuth} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2">Name</label>
              <input type="text" required placeholder="Enter full name" onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-dark-pink/10 font-bold outline-none" />
            </div>
          )}
          <div className="space-y-2">
            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2">Email Address</label>
            <input type="email" required placeholder="example@email.com" onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-dark-pink/10 font-bold outline-none" />
          </div>
          {!isLogin && (
            <div className="space-y-2">
              <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2">Phone</label>
              <input type="tel" required placeholder="10-digit number" onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-dark-pink/10 font-bold outline-none" />
            </div>
          )}
          <div className="space-y-2">
            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 ml-2">Password</label>
            <input type="password" required placeholder="••••••••" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-dark-pink/10 font-bold outline-none" />
          </div>
          
          <button type="submit" className="w-full bg-dark-pink text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-hover-pink hover:shadow-pink-200 transition-all active:scale-95 text-sm">
            {isLogin ? t.login : 'Sign Up'}
          </button>
        </form>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
          <div className="relative flex justify-center text-xs uppercase font-black tracking-widest text-gray-300"><span className="bg-white px-4">OR</span></div>
        </div>

        <p className="text-center text-sm font-bold text-gray-400">
          {isLogin ? "New to Florist?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-dark-green hover:text-dark-pink transition-colors underline-offset-4 underline">
            {isLogin ? 'Join Now' : t.login}
          </button>
        </p>
        
        {isLogin && (
          <div className="p-5 bg-dark-green rounded-2xl border border-dark-green/20 text-[10px] text-white font-bold leading-relaxed shadow-lg">
            🔐 <span className="uppercase tracking-widest ml-1">Admin Access:</span> Use <span className="bg-white/20 px-1.5 rounded">admin@florist.com</span> to unlock full Inventory Management CRUD tools!
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
