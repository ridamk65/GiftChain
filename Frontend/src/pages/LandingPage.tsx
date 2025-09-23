import React from 'react';
import { useNavigate } from 'react-router-dom';
const LandingPage = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500">
      {/* Abstract background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[10%] left-[15%] w-[300px] h-[300px] rounded-full bg-pink-500/20 blur-3xl"></div>
        <div className="absolute top-[40%] right-[15%] w-[400px] h-[400px] rounded-full bg-yellow-500/20 blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[35%] w-[350px] h-[350px] rounded-full bg-blue-500/20 blur-3xl"></div>
      </div>
      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-black/30 backdrop-blur-sm p-8 sm:p-12 rounded-2xl shadow-2xl border border-white/10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white tracking-tight">
              Empower Change with
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-400 ml-2">
                GiftChain
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Experience true transparency in charitable giving. Every donation
              is securely tracked on the blockchain, ensuring your generosity
              reaches those who need it most.
            </p>
            <button onClick={() => navigate('/signin')} className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-full overflow-hidden shadow-lg transition-all duration-300 hover:shadow-pink-500/30 hover:scale-105">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
              <span className="relative flex items-center">
                <span className="mr-2 text-2xl animate-pulse">❤️</span>
                Get Started
              </span>
            </button>
          </div>
        </div>
      </div>
      {/* Floating blockchain-like elements */}
      <div className="absolute bottom-10 left-10 w-20 h-20 bg-white/10 rounded-lg backdrop-blur-md border border-white/20 animate-float1"></div>
      <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-lg backdrop-blur-md border border-white/20 animate-float2"></div>
      <div className="absolute top-40 left-[20%] w-12 h-12 bg-white/10 rounded-lg backdrop-blur-md border border-white/20 animate-float3"></div>
      <div className="absolute bottom-32 right-[25%] w-14 h-14 bg-white/10 rounded-lg backdrop-blur-md border border-white/20 animate-float2"></div>
    </div>;
};
export default LandingPage;