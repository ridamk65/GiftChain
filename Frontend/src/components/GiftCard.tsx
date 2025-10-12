import React, { useRef } from 'react';
import QRCode from 'qrcode';

interface GiftCardProps {
  giftId: string;
  message: string;
  amount: string;
  senderName?: string;
  recipientName?: string;
  expiryDate?: string;
}

export const GiftCard: React.FC<GiftCardProps> = ({
  giftId,
  message,
  amount,
  senderName = "Anonymous",
  recipientName = "Dear Friend",
  expiryDate
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>('');
  const [shareUrl, setShareUrl] = React.useState<string>('');

  React.useEffect(() => {
    if (giftId) {
      const giftUrl = `${process.env.REACT_APP_FRONTEND_URL || 'http://localhost:5173'}/gift?id=${giftId}`;
      setShareUrl(giftUrl);
      
      QRCode.toDataURL(giftUrl, {
        width: 120,
        margin: 1,
        color: { dark: '#1F2937', light: '#FFFFFF' }
      }).then(setQrCodeUrl);
    }
  }, [giftId]);

  const downloadCard = () => {
    if (!cardRef.current) return;
    
    // Create a canvas to render the card
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 500;

    // Create image from HTML
    import('html2canvas').then(html2canvas => {
      html2canvas.default(cardRef.current!, {
        width: 800,
        height: 500,
        scale: 2
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `giftcard-${giftId.slice(0, 8)}.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    }).catch(() => {
      // Fallback: open print dialog
      window.print();
    });
  };

  const printCard = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const cardHTML = cardRef.current?.outerHTML || '';
    const sanitizedHTML = cardHTML.replace(/[<>"'&]/g, (match) => {
      const entities: {[key: string]: string} = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '&': '&amp;'
      };
      return entities[match] || match;
    });
    
    printWindow.document.write(`
      <html>
        <head>
          <title>GiftChain Gift Card</title>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .gift-card { width: 100%; max-width: 800px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="gift-card">Gift Card Content</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Gift Card */}
      <div 
        ref={cardRef}
        className="relative w-full h-96 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl shadow-2xl overflow-hidden"
        style={{ aspectRatio: '16/10' }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-4 right-4 w-24 h-24 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white rounded-full"></div>
        </div>

        {/* Card Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-8 text-white">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">🎁 GiftChain</h1>
              <p className="text-lg opacity-90">Crypto Gift Card</p>
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

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full transform -translate-x-12 translate-y-12"></div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6 justify-center">
        <button
          onClick={downloadCard}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          📥 Download Card
        </button>
        
        <button
          onClick={printCard}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 flex items-center gap-2"
        >
          🖨️ Print Card
        </button>
        
        <button
          onClick={() => {
            navigator.clipboard.writeText(shareUrl);
            alert('Gift link copied to clipboard!');
          }}
          className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 flex items-center gap-2"
        >
          📋 Copy Link
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
        <h3 className="font-semibold mb-2">How to use this gift card:</h3>
        <ol className="text-sm space-y-1 list-decimal list-inside text-gray-600">
          <li>Share this card with the recipient (print, email, or send digitally)</li>
          <li>Recipient scans the QR code or visits the claim link</li>
          <li>Connects their wallet and claims the crypto gift</li>
          <li>Tokens are transferred to their wallet instantly</li>
        </ol>
      </div>
    </div>
  );
};