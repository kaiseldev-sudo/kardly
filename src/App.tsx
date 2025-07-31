import { useState, useRef, useEffect } from 'react';
import type { BusinessCardData, CardTheme, CustomCardDesign } from './types';
import { cardThemes } from './data/themes';
import BusinessCard from './components/BusinessCard';
import CardForm from './components/CardForm';
import ExportButtons from './components/ExportButtons';
import CustomDesignEditor from './components/CustomDesignEditor';
import { Save, Share2, Palette } from 'lucide-react';

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
  const [customDesign, setCustomDesign] = useState<CustomCardDesign | null>(null);
  const [showCustomEditor, setShowCustomEditor] = useState(false);
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
    try {
      // Generate a unique ID for this card
      const cardId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      
      // Store the card data in localStorage with the unique ID
      const cardDataToStore = {
        data: cardData,
        theme: selectedTheme,
        timestamp: Date.now()
      };
      
      localStorage.setItem(`kardly-shared-${cardId}`, JSON.stringify(cardDataToStore));
      
      // Create a shorter URL with just the ID
      const shareableUrl = `${window.location.origin}${window.location.pathname}?shared=${cardId}`;
      
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(shareableUrl).then(() => {
          alert('Shareable link copied to clipboard!');
        }).catch((error) => {
          console.error('Clipboard API failed:', error);
          fallbackCopyToClipboard(shareableUrl);
        });
      } else {
        fallbackCopyToClipboard(shareableUrl);
      }
    } catch (error) {
      console.error('Error generating shareable link:', error);
      alert('Error generating shareable link. Please try again.');
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        alert('Shareable link copied to clipboard!');
      } else {
        alert('Failed to copy link. Please copy manually: ' + text);
      }
    } catch (error) {
      console.error('Fallback copy failed:', error);
      alert('Failed to copy link. Please copy manually: ' + text);
    }
  };

  // Load card from URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cardParam = urlParams.get('card');
    const sharedParam = urlParams.get('shared');
    
    if (sharedParam) {
      console.log('Loading shared card from localStorage');
      try {
        const storedData = localStorage.getItem(`kardly-shared-${sharedParam}`);
        if (storedData) {
          const parsed = JSON.parse(storedData);
          console.log('Loaded shared card data:', parsed);
          
          setCardData(parsed.data);
          setSelectedTheme(parsed.theme);
        } else {
          console.error('Shared card not found in localStorage');
          alert('Shared card not found. The link may be expired or invalid.');
        }
      } catch (error) {
        console.error('Error loading shared card from localStorage:', error);
        alert('Error loading shared card. The link may be invalid or corrupted.');
      }
    } else if (cardParam) {
      // Handle old URL format for backward compatibility
      console.log('Loading shared card from URL parameter (old format)');
      try {
        const decodedParam = decodeURIComponent(cardParam);
        const decoded = JSON.parse(atob(decodedParam));
        console.log('Decoded card data:', decoded);
        
        // Handle both old and new compressed format
        if (decoded.data && decoded.theme) {
          // Old format
          console.log('Using old format');
          setCardData(decoded.data);
          setSelectedTheme(decoded.theme);
        } else {
          // New compressed format
          console.log('Using new compressed format');
          const expandedData = {
            name: decoded.n || '',
            title: decoded.t || '',
            company: decoded.c || '',
            phone: decoded.p || '',
            email: decoded.e || '',
            website: decoded.w || '',
            linkedin: decoded.l || '',
            address: decoded.a || '',
            logo: decoded.logo || '',
            profileImage: decoded.img || '',
          };
          
          console.log('Expanded data:', expandedData);
          setCardData(expandedData);
          
          // Find the theme by ID
          const theme = cardThemes.find(t => t.id === decoded.th);
          if (theme) {
            console.log('Found theme:', theme.name);
            setSelectedTheme(theme);
          } else {
            console.warn('Theme not found:', decoded.th);
            // Fallback to first theme if the specified theme is not found
            setSelectedTheme(cardThemes[0]);
          }
        }
      } catch (error) {
        console.error('Error loading card from URL:', error);
        alert('Error loading shared card. The link may be invalid or corrupted.');
      }
    }
  }, [cardThemes]);

  // Check if this is a shared card view
  const isSharedView = window.location.search.includes('shared=') || window.location.search.includes('card=');

  if (isSharedView) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
                            <BusinessCard
                    data={cardData}
                    theme={selectedTheme}
                    customDesign={customDesign || undefined}
                  />
        </div>
      </div>
    );
  }

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
                onClick={() => setShowCustomEditor(true)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Palette size={16} />
                <span>Custom Design</span>
              </button>
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
          </div>
        </div>
      </div>

      {/* Custom Design Editor */}
      {showCustomEditor && (
        <CustomDesignEditor
          cardData={cardData}
          theme={selectedTheme}
          onDesignChange={setCustomDesign}
          onClose={() => setShowCustomEditor(false)}
        />
      )}
    </div>
  );
}

export default App; 