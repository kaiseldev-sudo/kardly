import React from 'react';
import type { BusinessCardData, CardTheme } from '../types';
import { Mail, Phone, Globe, Linkedin, MapPin } from 'lucide-react';

interface BusinessCardProps {
  data: BusinessCardData;
  theme: CardTheme;
  className?: string;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ data, theme, className = '' }) => {
  const isHorizontal = theme.layout === 'horizontal';
  const cardClass = isHorizontal ? 'card-preview-horizontal card-responsive' : 'card-preview card-responsive';

  const renderFrontCard = () => (
    <div 
      className={`card-front ${className}`}
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
      }}
    >
      {/* Logo */}
      {data.logo && (
        <div className={`front-logo flex items-center justify-center ${theme.colors.background === '#000000' ? 'logo-container-dark' : 'logo-container'}`}>
          <img src={data.logo} alt="Logo" className="w-16 h-16 object-contain" />
        </div>
      )}
      
      {/* Name */}
      <h1 
        className={`${theme.font.heading} front-name`}
        style={{ color: theme.colors.primary }}
      >
        {data.name || 'Your Name'}
      </h1>
      
      {/* Title */}
      <p 
        className={`${theme.font.body} front-title`}
        style={{ color: theme.colors.secondary }}
      >
        {data.title || 'Your Title'}
      </p>
      
      {/* Company */}
      <p 
        className={`${theme.font.body} front-company`}
        style={{ color: theme.colors.primary }}
      >
        {data.company || 'Your Company'}
      </p>
    </div>
  );

  const renderBackCard = () => (
    <div 
      className={`card-back ${className}`}
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
      }}
    >
      {/* Contact Info */}
      <div className="contact-grid">
        {data.phone && (
          <div className="contact-item">
            <Phone className="icon-responsive flex-shrink-0" style={{ color: theme.colors.accent }} />
            <span className={`${theme.font.body} contact-text`} style={{ color: theme.colors.text }} title={data.phone}>
              {data.phone}
            </span>
          </div>
        )}
        {data.email && (
          <div className="contact-item">
            <Mail className="icon-responsive flex-shrink-0" style={{ color: theme.colors.accent }} />
            <span className={`${theme.font.body} contact-text`} style={{ color: theme.colors.text }} title={data.email}>
              {data.email}
            </span>
          </div>
        )}
        {data.website && (
          <div className="contact-item">
            <Globe className="icon-responsive flex-shrink-0" style={{ color: theme.colors.accent }} />
            <span className={`${theme.font.body} contact-text`} style={{ color: theme.colors.text }} title={data.website}>
              {data.website}
            </span>
          </div>
        )}
        {data.linkedin && (
          <div className="contact-item">
            <Linkedin className="icon-responsive flex-shrink-0" style={{ color: theme.colors.accent }} />
            <span className={`${theme.font.body} contact-text`} style={{ color: theme.colors.text }} title={data.linkedin}>
              {data.linkedin}
            </span>
          </div>
        )}
        {data.address && (
          <div className="contact-item">
            <MapPin className="icon-responsive flex-shrink-0" style={{ color: theme.colors.accent }} />
            <span className={`${theme.font.body} contact-text`} style={{ color: theme.colors.text }} title={data.address}>
              {data.address}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const renderDualCards = () => (
    <div className="card-dual-container">
      {renderFrontCard()}
      {renderBackCard()}
    </div>
  );

  // For backward compatibility, keep the original single card layouts
  const renderVerticalCard = () => (
    <div 
      className={`${cardClass} ${className}`}
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 
            className={`${theme.font.heading} heading-responsive mb-0.5`}
            style={{ color: theme.colors.primary }}
          >
            {data.name || 'Your Name'}
          </h1>
          <p 
            className={`${theme.font.body} subheading-responsive mb-0.5`}
            style={{ color: theme.colors.secondary }}
          >
            {data.title || 'Your Title'}
          </p>
          <p 
            className={`${theme.font.body} subheading-responsive font-medium`}
            style={{ color: theme.colors.primary }}
          >
            {data.company || 'Your Company'}
          </p>
        </div>
        {data.logo && (
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${theme.colors.background === '#000000' ? 'logo-container-dark' : 'logo-container'}`}>
            <img src={data.logo} alt="Logo" className="w-7 h-7 object-contain" />
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="contact-grid">
        {data.phone && (
          <div className="contact-item">
            <Phone className="icon-responsive flex-shrink-0" style={{ color: theme.colors.accent }} />
            <span className={`${theme.font.body} contact-text`} style={{ color: theme.colors.text }} title={data.phone}>
              {data.phone}
            </span>
          </div>
        )}
        {data.email && (
          <div className="contact-item">
            <Mail className="icon-responsive flex-shrink-0" style={{ color: theme.colors.accent }} />
            <span className={`${theme.font.body} contact-text`} style={{ color: theme.colors.text }} title={data.email}>
              {data.email}
            </span>
          </div>
        )}
        {data.website && (
          <div className="contact-item">
            <Globe className="icon-responsive flex-shrink-0" style={{ color: theme.colors.accent }} />
            <span className={`${theme.font.body} contact-text`} style={{ color: theme.colors.text }} title={data.website}>
              {data.website}
            </span>
          </div>
        )}
        {data.linkedin && (
          <div className="contact-item">
            <Linkedin className="icon-responsive flex-shrink-0" style={{ color: theme.colors.accent }} />
            <span className={`${theme.font.body} contact-text`} style={{ color: theme.colors.text }} title={data.linkedin}>
              {data.linkedin}
            </span>
          </div>
        )}
        {data.address && (
          <div className="contact-item">
            <MapPin className="icon-responsive flex-shrink-0" style={{ color: theme.colors.accent }} />
            <span className={`${theme.font.body} contact-text`} style={{ color: theme.colors.text }} title={data.address}>
              {data.address}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const renderHorizontalCard = () => (
    <div 
      className={`${cardClass} ${className}`}
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
      }}
    >
      {/* Left side - Logo/Image */}
      <div className="flex-shrink-0">
        {data.logo ? (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${theme.colors.background === '#000000' ? 'logo-container-dark' : 'logo-container'}`}>
            <img src={data.logo} alt="Logo" className="w-9 h-9 object-contain" />
          </div>
        ) : (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${theme.colors.background === '#000000' ? 'logo-container-dark' : 'logo-container'}`}>
            <div className="text-xs text-center" 
                 style={{ color: theme.colors.background === '#000000' ? '#000000' : '#9ca3af' }}>
              LOGO
            </div>
          </div>
        )}
      </div>

      {/* Right side - Content */}
      <div className="flex-1 min-w-0">
        <div className="mb-2">
          <h1 
            className={`${theme.font.heading} heading-responsive mb-0.5`}
            style={{ color: theme.colors.primary }}
          >
            {data.name || 'Your Name'}
          </h1>
          <p 
            className={`${theme.font.body} subheading-responsive mb-0.5`}
            style={{ color: theme.colors.secondary }}
          >
            {data.title || 'Your Title'}
          </p>
          <p 
            className={`${theme.font.body} subheading-responsive font-medium`}
            style={{ color: theme.colors.primary }}
          >
            {data.company || 'Your Company'}
          </p>
        </div>

        {/* Contact Info in single column to prevent overlap */}
        <div className="flex flex-col gap-1">
          {data.phone && (
            <div className="contact-item">
              <Phone className="icon-responsive flex-shrink-0" style={{ color: theme.colors.accent }} />
              <span className={`${theme.font.body} contact-text`} style={{ color: theme.colors.text }} title={data.phone}>
                {data.phone}
              </span>
            </div>
          )}
          {data.email && (
            <div className="contact-item">
              <Mail className="icon-responsive flex-shrink-0" style={{ color: theme.colors.accent }} />
              <span className={`${theme.font.body} contact-text`} style={{ color: theme.colors.text }} title={data.email}>
                {data.email}
              </span>
            </div>
          )}
          {data.website && (
            <div className="contact-item">
              <Globe className="icon-responsive flex-shrink-0" style={{ color: theme.colors.accent }} />
              <span className={`${theme.font.body} contact-text`} style={{ color: theme.colors.text }} title={data.website}>
                {data.website}
              </span>
            </div>
          )}
          {data.linkedin && (
            <div className="contact-item">
              <Linkedin className="icon-responsive flex-shrink-0" style={{ color: theme.colors.accent }} />
              <span className={`${theme.font.body} contact-text`} style={{ color: theme.colors.text }} title={data.linkedin}>
                {data.linkedin}
              </span>
            </div>
          )}
          {data.address && (
            <div className="contact-item">
              <MapPin className="icon-responsive flex-shrink-0" style={{ color: theme.colors.accent }} />
              <span className={`${theme.font.body} contact-text`} style={{ color: theme.colors.text }} title={data.address}>
                {data.address}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Return dual cards by default, fallback to original layouts
  return renderDualCards();
};

export default BusinessCard; 