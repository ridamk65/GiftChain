import React, { useState } from 'react';

interface SocialShareProps {
  giftId: string;
  message: string;
  amount: string;
  senderName?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  giftId,
  message,
  amount,
  senderName = "Someone"
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  const giftUrl = `${window.location.origin}/gift?id=${giftId}`;
  const shareText = `🎁 ${senderName} sent you a crypto gift of ${amount} tokens! "${message}" - Claim it now:`;

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + giftUrl)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareToTwitter = () => {
    const twitterText = `🎁 Just received a crypto gift on @GiftChain! ${amount} tokens with message: "${message}" 🚀 #CryptoGifting #Blockchain`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(giftUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareToTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(giftUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(telegramUrl, '_blank');
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(giftUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank');
  };

  const shareToLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(giftUrl)}`;
    window.open(linkedInUrl, '_blank');
  };

  const copyToClipboard = () => {
    const fullText = `${shareText}\n\n${giftUrl}`;
    navigator.clipboard.writeText(fullText).then(() => {
      alert('🔗 Gift message and link copied to clipboard!');
    });
  };

  const shareViaEmail = () => {
    const subject = `🎁 You've received a crypto gift!`;
    const body = `${shareText}\n\n${giftUrl}\n\nPowered by GiftChain - Decentralized Crypto Gifting`;
    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl);
  };

  const shareViaSMS = () => {
    const smsText = `${shareText} ${giftUrl}`;
    const smsUrl = `sms:?body=${encodeURIComponent(smsText)}`;
    window.open(smsUrl);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 flex items-center gap-2"
      >
        📱 Share Gift
      </button>

      {showShareMenu && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border p-4 z-50 min-w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Share Your Gift</h3>
            <button
              onClick={() => setShowShareMenu(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* WhatsApp */}
            <button
              onClick={shareToWhatsApp}
              className="flex items-center gap-2 p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
            >
              <span className="text-2xl">💬</span>
              <span className="text-sm font-medium">WhatsApp</span>
            </button>

            {/* Twitter */}
            <button
              onClick={shareToTwitter}
              className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <span className="text-2xl">🐦</span>
              <span className="text-sm font-medium">Twitter</span>
            </button>

            {/* Telegram */}
            <button
              onClick={shareToTelegram}
              className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <span className="text-2xl">✈️</span>
              <span className="text-sm font-medium">Telegram</span>
            </button>

            {/* Facebook */}
            <button
              onClick={shareToFacebook}
              className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <span className="text-2xl">📘</span>
              <span className="text-sm font-medium">Facebook</span>
            </button>

            {/* Email */}
            <button
              onClick={shareViaEmail}
              className="flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              <span className="text-2xl">📧</span>
              <span className="text-sm font-medium">Email</span>
            </button>

            {/* SMS */}
            <button
              onClick={shareViaSMS}
              className="flex items-center gap-2 p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
            >
              <span className="text-2xl">💬</span>
              <span className="text-sm font-medium">SMS</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors col-span-2"
            >
              <span className="text-2xl">📋</span>
              <span className="text-sm font-medium">Copy Message & Link</span>
            </button>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">Preview message:</p>
            <p className="text-sm text-gray-800">"{shareText}"</p>
          </div>
        </div>
      )}
    </div>
  );
};