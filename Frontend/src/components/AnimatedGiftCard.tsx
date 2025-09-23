import React, { useRef, useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { GiftTemplate } from './GiftTemplates';

interface AnimatedGiftCardProps {
  giftId: string;
  message: string;
  amount: string;
  senderName?: string;
  recipientName?: string;
  expiryDate?: string;
  template: GiftTemplate;
  playMusic?: boolean;
}

export const AnimatedGiftCard: React.FC<AnimatedGiftCardProps> = ({
  giftId,
  message,
  amount,
  senderName = "Anonymous",
  recipientName = "Dear Friend",
  expiryDate,
  template,
  playMusic = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (giftId) {
      const giftUrl = `http://10.98.26.231:5173/gift?id=${giftId}`;
      QRCode.toDataURL(giftUrl, {
        width: 120,
        margin: 1,
        color: { dark: '#1F2937', light: '#FFFFFF' }
      }).then(setQrCodeUrl);
    }
  }, [giftId]);

  useEffect(() => {
    if (playMusic && audioRef.current && template.music) {
      audioRef.current.play().catch(() => {
        console.log('Audio autoplay blocked');
      });
      setIsPlaying(true);
    }
  }, [playMusic, template.music]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const getAnimationClass = () => {
    switch (template.animation) {
      case 'bounce': return 'animate-bounce';
      case 'snow': return 'animate-pulse';
      case 'hearts': return 'animate-ping';
      case 'confetti': return 'animate-spin';
      case 'sparkle': return 'animate-pulse';
      default: return '';
    }
  };

  const renderAnimationElements = () => {
    switch (template.animation) {
      case 'hearts':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute text-pink-300 text-2xl animate-bounce"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + (i % 3) * 30}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '2s'
                }}
              >
                💖
              </div>
            ))}
          </div>
        );
      
      case 'snow':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute text-white text-lg animate-bounce"
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${5 + (i % 4) * 25}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '3s'
                }}
              >
                ❄️
              </div>
            ))}
          </div>
        );
      
      case 'confetti':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute text-yellow-300 text-sm animate-ping"
                style={{
                  left: `${15 + i * 10}%`,
                  top: `${8 + (i % 5) * 20}%`,
                  animationDelay: `${i * 0.2}s`
                }}
              >
                🎉
              </div>
            ))}
          </div>
        );
      
      case 'petals':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute text-pink-200 text-lg animate-pulse"
                style={{
                  left: `${25 + i * 15}%`,
                  top: `${15 + (i % 2) * 40}%`,
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: '4s'
                }}
              >
                🌸
              </div>
            ))}
          </div>
        );
      
      case 'stars':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="absolute text-yellow-200 text-xl animate-ping"
                style={{
                  left: `${18 + i * 12}%`,
                  top: `${12 + (i % 3) * 30}%`,
                  animationDelay: `${i * 0.4}s`
                }}
              >
                ⭐
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Audio Element */}
      {template.music && (
        <audio ref={audioRef} loop>
          <source src={template.music} type="audio/mpeg" />
        </audio>
      )}

      {/* Music Control */}
      {template.music && (
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleMusic}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              isPlaying ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {isPlaying ? '🔊' : '🔇'} {isPlaying ? 'Playing' : 'Play Music'}
          </button>
        </div>
      )}

      {/* Animated Gift Card */}
      <div 
        ref={cardRef}
        className={`relative w-full h-96 bg-gradient-to-br ${template.colors.primary} rounded-2xl shadow-2xl overflow-hidden ${getAnimationClass()}`}
        style={{ aspectRatio: '16/10' }}
      >
        {/* Animation Elements */}
        {renderAnimationElements()}

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-4 right-4 w-24 h-24 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white rounded-full"></div>
        </div>

        {/* Card Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-8 text-white">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{template.emoji}</span>
                <div>
                  <h1 className="text-3xl font-bold">🎁 GiftChain</h1>
                  <p className="text-lg opacity-90">{template.occasion} Gift</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <p className="text-2xl font-bold">{amount}</p>
                <p className="text-sm opacity-80">TOKENS</p>
              </div>
            </div>
          </div>

          {/* Middle Content */}
          <div className="flex-1 flex items-center justify-between">
            <div className="flex-1">
              <div className="mb-6">
                <p className="text-sm opacity-80 mb-1">TO:</p>
                <p className="text-xl font-semibold">{recipientName}</p>
              </div>
              
              <div className="mb-6">
                <p className="text-sm opacity-80 mb-1">MESSAGE:</p>
                <p className="text-lg italic">"{message}"</p>
              </div>
              
              <div>
                <p className="text-sm opacity-80 mb-1">FROM:</p>
                <p className="text-lg font-semibold">{senderName}</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="ml-8 text-center">
              {qrCodeUrl && (
                <div className="bg-white p-3 rounded-lg">
                  <img src={qrCodeUrl} alt="Claim QR Code" className="w-24 h-24" />
                </div>
              )}
              <p className="text-xs mt-2 opacity-80">Scan to Claim</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end text-sm opacity-80">
            <div>
              <p>Gift ID: {giftId.slice(0, 16)}...</p>
            </div>
            {expiryDate && (
              <div>
                <p>Expires: {expiryDate}</p>
              </div>
            )}
          </div>
        </div>

        {/* Special Occasion Badge */}
        <div className="absolute top-4 right-4 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
          {template.occasion}
        </div>
      </div>

      {/* Template Info */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          <strong>{template.name}</strong> - {template.description}
        </p>
      </div>
    </div>
  );
};