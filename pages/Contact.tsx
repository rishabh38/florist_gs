
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { translations } from '../data/translations';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const { current } = useSelector((state: RootState) => state.language);
  const t = translations[current];

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    // Name validation
    if (!form.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(form.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    // Message validation
    if (!form.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (form.message.trim().length < 20) {
      newErrors.message = 'Message should be at least 20 characters long';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      setErrors({});
      
      // Simulating a server-side submission/validation delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitting(false);
      setSubmitted(true);
    } else {
      setErrors(validationErrors);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto pt-40 px-8 text-center animate-in fade-in duration-700">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Send className="text-dark-green" size={40} />
        </div>
        <h2 className="text-4xl font-bold text-dark-green mb-4">Message Sent Successfully!</h2>
        <p className="text-xl text-gray-600">We've received your inquiry and our floral consultants will get back to you shortly.</p>
        <button 
          onClick={() => setSubmitted(false)} 
          className="mt-8 bg-dark-green text-white px-8 py-3 rounded-full font-bold hover:bg-hover-green transition-all"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 pt-24 pb-12 grid grid-cols-1 md:grid-cols-2 gap-16">
      <div className="space-y-8">
        <div>
          <h1 className="text-5xl font-bold text-dark-green mb-6">Let's Connect</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Have a custom requirement or a question about our collections? Our experts are ready to assist you in creating the perfect floral experience.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-50">
            <div className="bg-pink-50 p-3 rounded-lg text-dark-pink">
              <MapPin size={24} />
            </div>
            <div>
              <h4 className="font-bold text-dark-green">Visit Us</h4>
              <p className="text-gray-500 text-sm">123 Flower Valley, MG Road, Mumbai, MH - 400001</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-50">
            <div className="bg-pink-50 p-3 rounded-lg text-dark-pink">
              <Mail size={24} />
            </div>
            <div>
              <h4 className="font-bold text-dark-green">Email Us</h4>
              <p className="text-gray-500 text-sm">support@florist.co.in</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-50">
            <div className="bg-pink-50 p-3 rounded-lg text-dark-pink">
              <Phone size={24} />
            </div>
            <div>
              <h4 className="font-bold text-dark-green">Call Us</h4>
              <p className="text-gray-500 text-sm">+91 98765 43210 (Mon-Sat, 9AM-8PM)</p>
            </div>
          </div>
        </div>
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl space-y-6 border border-gray-100"
        noValidate
      >
        <div className="space-y-1">
          <label htmlFor="name" className="block text-sm font-bold text-gray-700">Full Name</label>
          <input 
            id="name"
            type="text" 
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
              errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-dark-green/20'
            }`}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && <p id="name-error" className="text-red-500 text-xs font-semibold mt-1">{errors.name}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-bold text-gray-700">Email Address</label>
          <input 
            id="email"
            type="email" 
            placeholder="john@example.com"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
              errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-dark-green/20'
            }`}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && <p id="email-error" className="text-red-500 text-xs font-semibold mt-1">{errors.email}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="phone" className="block text-sm font-bold text-gray-700">Mobile Number</label>
          <input 
            id="phone"
            type="tel" 
            placeholder="9876543210"
            value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value})}
            className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
              errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-dark-green/20'
            }`}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone && <p id="phone-error" className="text-red-500 text-xs font-semibold mt-1">{errors.phone}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="message" className="block text-sm font-bold text-gray-700">How can we help?</label>
          <textarea 
            id="message"
            rows={4} 
            placeholder="Describe your request in detail..."
            value={form.message}
            onChange={(e) => setForm({...form, message: e.target.value})}
            className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
              errors.message ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-dark-green/20'
            }`}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          ></textarea>
          {errors.message && <p id="message-error" className="text-red-500 text-xs font-semibold mt-1">{errors.message}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`w-full bg-dark-pink hover:bg-hover-pink text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Validating...</span>
            </span>
          ) : (
            <>
              <Send size={20} />
              <span>Send Message</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Contact;
