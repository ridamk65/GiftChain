import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/useTranslation';

interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rate: number;
  flag: string;
}

// Mock exchange rates (in production, fetch from API)
const mockRates: Record<string, CurrencyRate[]> = {
  en: [
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1, flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85, flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.73, flag: '🇬🇧' }
  ],
  es: [
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 1, flag: '🇪🇺' },
    { code: 'USD', name: 'Dólar Estadounidense', symbol: '$', rate: 1.18, flag: '🇺🇸' },
    { code: 'MXN', name: 'Peso Mexicano', symbol: '$', rate: 20.5, flag: '🇲🇽' }
  ],
  fr: [
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 1, flag: '🇪🇺' },
    { code: 'USD', name: 'Dollar Américain', symbol: '$', rate: 1.18, flag: '🇺🇸' },
    { code: 'CAD', name: 'Dollar Canadien', symbol: 'C$', rate: 1.45, flag: '🇨🇦' }
  ],
  de: [
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 1, flag: '🇪🇺' },
    { code: 'USD', name: 'US-Dollar', symbol: '$', rate: 1.18, flag: '🇺🇸' },
    { code: 'CHF', name: 'Schweizer Franken', symbol: 'CHF', rate: 1.08, flag: '🇨🇭' }
  ],
  ja: [
    { code: 'JPY', name: '日本円', symbol: '¥', rate: 1, flag: '🇯🇵' },
    { code: 'USD', name: '米ドル', symbol: '$', rate: 0.0067, flag: '🇺🇸' },
    { code: 'EUR', name: 'ユーロ', symbol: '€', rate: 0.0057, flag: '🇪🇺' }
  ],
  zh: [
    { code: 'CNY', name: '人民币', symbol: '¥', rate: 1, flag: '🇨🇳' },
    { code: 'USD', name: '美元', symbol: '$', rate: 0.14, flag: '🇺🇸' },
    { code: 'EUR', name: '欧元', symbol: '€', rate: 0.12, flag: '🇪🇺' }
  ]
};

interface CurrencyConverterProps {
  tokenAmount: string;
  tokenPrice?: number; // Price per token in USD
}

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ 
  tokenAmount, 
  tokenPrice = 2.5 // Default mock price
}) => {
  const { language } = useTranslation();
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyRate>();
  const [showConverter, setShowConverter] = useState(false);

  const availableCurrencies = mockRates[language] || mockRates.en;

  useEffect(() => {
    // Set default currency based on language
    setSelectedCurrency(availableCurrencies[0]);
  }, [language]);

  const calculateFiatValue = () => {
    if (!selectedCurrency || !tokenAmount) return '0.00';
    
    const tokens = parseFloat(tokenAmount);
    const usdValue = tokens * tokenPrice;
    const localValue = usdValue * selectedCurrency.rate;
    
    return localValue.toLocaleString(language, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  if (!tokenAmount || parseFloat(tokenAmount) === 0) return null;

  return (
    <div className="bg-gray-50 p-3 rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">≈</span>
          <span className="font-semibold text-gray-800">
            {selectedCurrency?.symbol}{calculateFiatValue()}
          </span>
          <span className="text-xs text-gray-500">{selectedCurrency?.code}</span>
        </div>
        
        <button
          onClick={() => setShowConverter(!showConverter)}
          className="text-xs text-blue-600 hover:text-blue-700"
        >
          {showConverter ? '▲' : '▼'}
        </button>
      </div>

      {showConverter && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-1 gap-2">
            {availableCurrencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => setSelectedCurrency(currency)}
                className={`flex items-center justify-between p-2 rounded text-sm transition-colors ${
                  selectedCurrency?.code === currency.code
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{currency.flag}</span>
                  <span>{currency.name}</span>
                </div>
                <span className="font-medium">
                  {currency.symbol}{(parseFloat(tokenAmount) * tokenPrice * currency.rate).toLocaleString(language, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </button>
            ))}
          </div>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            * Exchange rates are approximate
          </div>
        </div>
      )}
    </div>
  );
};