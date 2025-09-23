import React from 'react';

export interface GiftTemplate {
  id: string;
  name: string;
  occasion: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  animation: string;
  music?: string;
  emoji: string;
  description: string;
}

export const giftTemplates: GiftTemplate[] = [
  {
    id: 'birthday',
    name: 'Birthday Celebration',
    occasion: 'Birthday',
    colors: {
      primary: 'from-pink-500 to-purple-600',
      secondary: 'from-yellow-400 to-orange-500',
      accent: '#FF6B9D'
    },
    animation: 'bounce',
    music: '/sounds/birthday.mp3',
    emoji: '🎂',
    description: 'Colorful birthday celebration with balloons and confetti'
  },
  {
    id: 'christmas',
    name: 'Christmas Magic',
    occasion: 'Christmas',
    colors: {
      primary: 'from-red-600 to-green-600',
      secondary: 'from-green-500 to-red-500',
      accent: '#FFD700'
    },
    animation: 'snow',
    music: '/sounds/christmas.mp3',
    emoji: '🎄',
    description: 'Festive Christmas theme with snow and holiday spirit'
  },
  {
    id: 'valentine',
    name: 'Love & Romance',
    occasion: 'Valentine\'s Day',
    colors: {
      primary: 'from-pink-400 to-red-500',
      secondary: 'from-rose-300 to-pink-400',
      accent: '#FF1744'
    },
    animation: 'hearts',
    music: '/sounds/romantic.mp3',
    emoji: '💝',
    description: 'Romantic theme with floating hearts and love vibes'
  },
  {
    id: 'wedding',
    name: 'Wedding Bliss',
    occasion: 'Wedding',
    colors: {
      primary: 'from-white to-pink-100',
      secondary: 'from-pink-200 to-purple-200',
      accent: '#E91E63'
    },
    animation: 'petals',
    music: '/sounds/wedding.mp3',
    emoji: '💒',
    description: 'Elegant wedding theme with rose petals and celebration'
  },
  {
    id: 'graduation',
    name: 'Achievement Unlocked',
    occasion: 'Graduation',
    colors: {
      primary: 'from-blue-600 to-indigo-700',
      secondary: 'from-yellow-400 to-orange-400',
      accent: '#2196F3'
    },
    animation: 'confetti',
    music: '/sounds/achievement.mp3',
    emoji: '🎓',
    description: 'Academic achievement with graduation cap and success vibes'
  },
  {
    id: 'promotion',
    name: 'Career Success',
    occasion: 'Promotion',
    colors: {
      primary: 'from-emerald-500 to-teal-600',
      secondary: 'from-yellow-400 to-green-400',
      accent: '#00BCD4'
    },
    animation: 'stars',
    music: '/sounds/success.mp3',
    emoji: '🚀',
    description: 'Professional success with upward momentum and achievement'
  },
  {
    id: 'anniversary',
    name: 'Anniversary Joy',
    occasion: 'Anniversary',
    colors: {
      primary: 'from-purple-500 to-pink-500',
      secondary: 'from-indigo-400 to-purple-400',
      accent: '#9C27B0'
    },
    animation: 'sparkle',
    music: '/sounds/celebration.mp3',
    emoji: '💖',
    description: 'Celebrating milestones with sparkles and joy'
  },
  {
    id: 'newborn',
    name: 'Welcome Baby',
    occasion: 'New Born',
    colors: {
      primary: 'from-blue-300 to-pink-300',
      secondary: 'from-yellow-200 to-blue-200',
      accent: '#81C784'
    },
    animation: 'gentle',
    music: '/sounds/lullaby.mp3',
    emoji: '👶',
    description: 'Gentle and soft theme for welcoming new life'
  }
];

export const TemplateSelector: React.FC<{
  selectedTemplate: GiftTemplate | null;
  onSelect: (template: GiftTemplate) => void;
}> = ({ selectedTemplate, onSelect }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-3">🎨 Choose Gift Template</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {giftTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
              selectedTemplate?.id === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`w-full h-16 bg-gradient-to-r ${template.colors.primary} rounded-lg mb-2 flex items-center justify-center text-2xl`}>
              {template.emoji}
            </div>
            <div className="text-xs font-medium text-gray-700">{template.name}</div>
            <div className="text-xs text-gray-500">{template.occasion}</div>
          </button>
        ))}
      </div>
      
      {selectedTemplate && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-600">
            <strong>{selectedTemplate.name}:</strong> {selectedTemplate.description}
          </p>
        </div>
      )}
    </div>
  );
};