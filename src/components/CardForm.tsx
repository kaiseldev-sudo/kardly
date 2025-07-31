import React from 'react';
import type { BusinessCardData, CardTheme } from '../types';
import { Upload, X } from 'lucide-react';

interface CardFormProps {
  data: BusinessCardData;
  onDataChange: (data: BusinessCardData) => void;
  selectedTheme: CardTheme;
  onThemeChange: (theme: CardTheme) => void;
  themes: CardTheme[];
}

const CardForm: React.FC<CardFormProps> = ({
  data,
  onDataChange,
  selectedTheme,
  onThemeChange,
  themes,
}) => {
  const handleInputChange = (field: keyof BusinessCardData, value: string) => {
    onDataChange({
      ...data,
      [field]: value,
    });
  };

  const handleFileUpload = (field: 'logo' | 'profileImage', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleInputChange(field, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (field: 'logo' | 'profileImage') => {
    handleInputChange(field, '');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Card Information</h2>
      
      {/* Theme Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Design Theme
        </label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme)}
              className={`p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                selectedTheme.id === theme.id
                  ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-200'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="text-left">
                <div className="font-semibold text-sm mb-1">{theme.name}</div>
                <div className="text-xs text-gray-500 mb-2">{theme.profession}</div>
                <div className="flex space-x-1">
                  <div 
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: theme.colors.primary }}
                  ></div>
                  <div 
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: theme.colors.secondary }}
                  ></div>
                  <div 
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: theme.colors.accent }}
                  ></div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="input-field"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title *
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="input-field"
            placeholder="Senior Developer"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company *
          </label>
          <input
            type="text"
            value={data.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className="input-field"
            placeholder="Tech Corp"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="input-field"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="input-field"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            type="url"
            value={data.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            className="input-field"
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn
          </label>
          <input
            type="url"
            value={data.linkedin}
            onChange={(e) => handleInputChange('linkedin', e.target.value)}
            className="input-field"
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            value={data.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="input-field"
            placeholder="123 Business St, City, State 12345"
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Logo
          </label>
          <div className="flex items-center space-x-3">
            {data.logo ? (
              <div className="relative">
                <img src={data.logo} alt="Logo" className="w-12 h-12 object-contain border rounded" />
                <button
                  onClick={() => removeImage('logo')}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  <X size={10} />
                </button>
              </div>
            ) : (
              <label className="flex items-center space-x-2 cursor-pointer">
                <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded flex items-center justify-center hover:border-gray-400">
                  <Upload size={20} className="text-gray-400" />
                </div>
                <span className="text-sm text-gray-600">Upload Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('logo', e)}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image
          </label>
          <div className="flex items-center space-x-3">
            {data.profileImage ? (
              <div className="relative">
                <img src={data.profileImage} alt="Profile" className="w-12 h-12 object-cover rounded-full border" />
                <button
                  onClick={() => removeImage('profileImage')}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  <X size={10} />
                </button>
              </div>
            ) : (
              <label className="flex items-center space-x-2 cursor-pointer">
                <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center hover:border-gray-400">
                  <Upload size={20} className="text-gray-400" />
                </div>
                <span className="text-sm text-gray-600">Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('profileImage', e)}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardForm; 