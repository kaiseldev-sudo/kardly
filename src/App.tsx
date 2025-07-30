import { useState, useRef, useEffect } from 'react';
import type { BusinessCardData, CardTheme } from './types';
import { cardThemes } from './data/themes';
import BusinessCard from './components/BusinessCard';
import CardForm from './components/CardForm';
import ExportButtons from './components/ExportButtons';
import { Save, Share2 } from 'lucide-react';

function App() {
  const [cardData, setCardData] = useState<BusinessCardData>({
    name: '',
    title: '',
    company: '',
    phone: '',
    email: '',
    website: '',
    linkedin: '',
    address: '',
    logo: '',
    profileImage: '',
  });

  const [selectedTheme, setSelectedTheme] = useState<CardTheme>(cardThemes[0]);
  const [savedCards, setSavedCards] = useState<Array<{ id: string; data: BusinessCardData; theme: CardTheme; timestamp: number }>>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  // Load saved cards from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('kardly-saved-cards');
    if (saved) {
      try {
        setSavedCards(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved cards:', error);
      }
    }
  }, []);

  // Save cards to localStorage whenever savedCards changes
  useEffect(() => {
    localStorage.setItem('kardly-saved-cards', JSON.stringify(savedCards));
  }, [savedCards]);

  const saveCurrentCard = () => {
    if (!cardData.name || !cardData.company) {
      alert('Please fill in at least your name and company to save the card.');
      return;
    }

    const newCard = {
      id: Date.now().toString(),
      data: cardData,
      theme: selectedTheme,
      timestamp: Date.now(),
    };

    setSavedCards(prev => [newCard, ...prev.slice(0, 9)]); // Keep only last 10 cards
    alert('Card saved successfully!');
  };

  const loadSavedCard = (savedCard: typeof savedCards[0]) => {
    setCardData(savedCard.data);
    setSelectedTheme(savedCard.theme);
  };

  const deleteSavedCard = (id: string) => {
    setSavedCards(prev => prev.filter(card => card.id !== id));
  };

  const generateShareableLink = () => {
    const cardDataString = btoa(JSON.stringify({ data: cardData, theme: selectedTheme }));
    const shareableUrl = `${window.location.origin}${window.location.pathname}?card=${cardDataString}`;
    
    navigator.clipboard.writeText(shareableUrl).then(() => {
      alert('Shareable link copied to clipboard!');
    }).catch(() => {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = shareableUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Shareable link copied to clipboard!');
    });
  };

  // Load card from URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cardParam = urlParams.get('card');
    if (cardParam) {
      try {
        const decoded = JSON.parse(atob(cardParam));
        setCardData(decoded.data);
        setSelectedTheme(decoded.theme);
      } catch (error) {
        console.error('Error loading card from URL:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Kardly</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={saveCurrentCard}
                className="btn-secondary flex items-center space-x-2"
              >
                <Save size={16} />
                <span>Save</span>
              </button>
              <button
                onClick={generateShareableLink}
                className="btn-primary flex items-center space-x-2"
              >
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <CardForm
              data={cardData}
              onDataChange={setCardData}
              selectedTheme={selectedTheme}
              onThemeChange={setSelectedTheme}
              themes={cardThemes}
            />

            {/* Saved Cards */}
            {savedCards.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Saved Cards</h3>
                <div className="space-y-3">
                  {savedCards.map((savedCard) => (
                    <div
                      key={savedCard.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {savedCard.data.name} - {savedCard.data.company}
                        </div>
                        <div className="text-sm text-gray-500">
                          {savedCard.theme.name} • {new Date(savedCard.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          onClick={() => loadSavedCard(savedCard)}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => deleteSavedCard(savedCard.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Preview</h2>
              
              {/* Card Preview */}
              <div className="flex justify-center  mb-6">
                <div ref={cardRef} className="w-full max-w-md">
                  <BusinessCard
                    data={cardData}
                    theme={selectedTheme}
                  />
                </div>
              </div>

              {/* Export Buttons */}
              <div className="flex justify-center">
                <ExportButtons
                  cardRef={cardRef}
                  cardData={cardData}
                />
              </div>
            </div>

            {/* Theme Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Theme</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Name:</span> {selectedTheme.name}
                </div>
                <div>
                  <span className="font-medium">Profession:</span> {selectedTheme.profession}
                </div>
                <div>
                  <span className="font-medium">Layout:</span> {selectedTheme.layout}
                </div>
                <div>
                  <span className="font-medium">Description:</span> {selectedTheme.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 