import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  giftId: string;
  message: string;
  amount: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ giftId, message, amount }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [shareUrl, setShareUrl] = useState<string>('');

  useEffect(() => {
    if (giftId) {
      const url = `${window.location.origin}/claim?id=${giftId}`;
      setShareUrl(url);
      
      QRCode.toDataURL(url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).then(setQrCodeUrl);
    }
  }, [giftId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Gift link copied to clipboard!');
  };

  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSending, setEmailSending] = useState(false);

  const shareViaEmail = () => {
    const subject = encodeURIComponent('🎁 You have received a crypto gift!');
    const body = encodeURIComponent(
      `You've received a crypto gift!\n\n` +
      `Message: ${message}\n` +
      `Amount: ${amount} tokens\n\n` +
      `Claim your gift here: ${shareUrl}\n\n` +
      `Or scan the QR code in the attached image.`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const sendEmailNotification = async () => {
    if (!recipientEmail || !giftId) return;
    
    setEmailSending(true);
    try {
      const response = await fetch(`http://localhost:3001/api/gifts/${giftId}/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipientEmail })
      });
      
      if (response.ok) {
        alert('📧 Email notification sent! Recipient will get expiry reminders too.');
        setRecipientEmail('');
      } else {
        alert('Failed to send email notification');
      }
    } catch (error) {
      console.error('Email error:', error);
      alert('Failed to send email notification');
    } finally {
      setEmailSending(false);
    }
  };

  // Auto-send email if recipient email is provided via URL
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get('email');
    if (emailFromUrl && giftId && !recipientEmail) {
      setRecipientEmail(emailFromUrl);
      // Auto-send after a short delay
      setTimeout(() => {
        sendEmailNotification();
      }, 2000);
    }
  }, [giftId]);

  if (!giftId) return null;

  return (
    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
      <h3 className="text-lg font-bold text-green-800 mb-4">🎁 Gift Created Successfully!</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-2">QR Code</h4>
          {qrCodeUrl && (
            <img 
              src={qrCodeUrl} 
              alt="Gift QR Code" 
              className="border rounded-lg shadow-sm"
            />
          )}
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">Gift Details</h4>
          <div className="space-y-2 text-sm">
            <p><strong>Gift ID:</strong> <code className="bg-gray-100 px-1 rounded text-xs">{giftId}</code></p>
            <p><strong>Message:</strong> {message}</p>
            <p><strong>Amount:</strong> {amount} tokens</p>
          </div>
          
          <div className="mt-4 space-y-2">
            <button
              onClick={copyToClipboard}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              📋 Copy Gift Link
            </button>
            
            <button
              onClick={shareViaEmail}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-2"
            >
              📧 Share via Email
            </button>
            
            <div className="border-t pt-3">
              <label className="block text-sm font-medium mb-1">Send notification to:</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="recipient@email.com"
                  className="flex-1 px-3 py-2 border rounded text-sm"
                />
                <button
                  onClick={sendEmailNotification}
                  disabled={!recipientEmail || emailSending}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
                >
                  {emailSending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Share this QR code or link with the recipient to claim the gift!</strong>
        </p>
      </div>
    </div>
  );
};