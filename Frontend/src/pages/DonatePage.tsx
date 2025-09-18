import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const DonatePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    amount: '',
    paymentMethod: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  const validateForm = () => {
    const newErrors = {};
    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    // Amount validation
    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    // Payment method validation
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }
    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Please provide a purpose for your donation';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        // Reset form after showing success message
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }, 1500);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 py-12 px-4 sm:px-6 lg:px-8">
      {/* Abstract background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[10%] left-[15%] w-[300px] h-[300px] rounded-full bg-pink-500/20 blur-3xl"></div>
        <div className="absolute top-[40%] right-[15%] w-[400px] h-[400px] rounded-full bg-yellow-500/20 blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[35%] w-[350px] h-[350px] rounded-full bg-blue-500/20 blur-3xl"></div>
      </div>
      <div className="w-full max-w-md relative z-10">
        {isSuccess ? <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 animate-fade-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Thank You!</h2>
              <p className="text-white/80 mb-6">
                Your donation has been successfully processed. A confirmation
                has been sent to your email.
              </p>
              <p className="text-white/60 text-sm mb-6">
                Transaction ID: {Math.random().toString(36).substring(2, 15)}
              </p>
              <button onClick={() => navigate('/')} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all">
                Return Home
              </button>
            </div>
          </div> : <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white">Make a Donation</h2>
              <p className="mt-2 text-white/70">
                Your generosity makes a difference
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-white/90 mb-1">
                  Full Name
                </label>
                <input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} className={`appearance-none relative block w-full px-4 py-3 border ${errors.fullName ? 'border-red-400' : 'border-white/20'} placeholder-white/40 text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`} placeholder="John Doe" />
                {errors.fullName && <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>}
              </div>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-1">
                  Email Address
                </label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={`appearance-none relative block w-full px-4 py-3 border ${errors.email ? 'border-red-400' : 'border-white/20'} placeholder-white/40 text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`} placeholder="john@example.com" />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
              </div>
              {/* Amount */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-white/90 mb-1">
                  Donation Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-white/50 sm:text-sm">$</span>
                  </div>
                  <input id="amount" name="amount" type="text" value={formData.amount} onChange={handleChange} className={`appearance-none relative block w-full pl-8 pr-4 py-3 border ${errors.amount ? 'border-red-400' : 'border-white/20'} placeholder-white/40 text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`} placeholder="100.00" />
                </div>
                {errors.amount && <p className="mt-1 text-sm text-red-400">{errors.amount}</p>}
              </div>
              {/* Payment Method */}
              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-white/90 mb-1">
                  Payment Method
                </label>
                <select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className={`appearance-none relative block w-full px-4 py-3 border ${errors.paymentMethod ? 'border-red-400' : 'border-white/20'} text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}>
                  <option value="" className="bg-gray-800">
                    Select a payment method
                  </option>
                  <option value="upi" className="bg-gray-800">
                    UPI
                  </option>
                  <option value="card" className="bg-gray-800">
                    Credit/Debit Card
                  </option>
                  <option value="crypto" className="bg-gray-800">
                    Cryptocurrency
                  </option>
                  <option value="bank" className="bg-gray-800">
                    Bank Transfer
                  </option>
                </select>
                {errors.paymentMethod && <p className="mt-1 text-sm text-red-400">
                    {errors.paymentMethod}
                  </p>}
              </div>
              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white/90 mb-1">
                  Purpose of Donation
                </label>
                <textarea id="message" name="message" rows={3} value={formData.message} onChange={handleChange} className={`appearance-none relative block w-full px-4 py-3 border ${errors.message ? 'border-red-400' : 'border-white/20'} placeholder-white/40 text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`} placeholder="Tell us why you're donating..." />
                {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}
              </div>
              {/* Submit Button */}
              <div className="pt-2">
                <button type="submit" disabled={isSubmitting} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-md font-medium rounded-lg text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 shadow-lg hover:shadow-pink-500/30">
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    {isSubmitting ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg> : <span className="text-xl">❤️</span>}
                  </span>
                  {isSubmitting ? 'Processing...' : 'Complete Donation'}
                </button>
              </div>
              {/* Back to Home Link */}
              <div className="text-center mt-4">
                <button type="button" onClick={() => navigate('/')} className="text-white/70 hover:text-white text-sm transition-colors">
                  ← Back to Home
                </button>
              </div>
            </form>
          </div>}
      </div>
    </div>;
};
export default DonatePage;