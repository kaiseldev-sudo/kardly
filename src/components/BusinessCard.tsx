import React from 'react';
import type { BusinessCardData, CardTheme, CustomCardDesign } from '../types';
import { Mail, Phone, Globe, Linkedin, MapPin } from 'lucide-react';

interface BusinessCardProps {
  data: BusinessCardData;
  theme: CardTheme;
  customDesign?: CustomCardDesign;
  className?: string;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ data, theme, customDesign, className = '' }) => {

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
          <img src={data.logo} alt="Logo" className="w-12 h-12 object-contain" />
        </div>
      )}
      
      {/* Content Container */}
      <div className="flex flex-col items-center justify-center flex-1 min-w-0 w-full px-1">
        {/* Name */}
        <h1 
          className={`${theme.font.heading} front-name`}
          style={{ color: theme.colors.primary }}
          title={data.name || 'Your Name'}
        >
          {data.name || 'Your Name'}
        </h1>
        
        {/* Title */}
        <p 
          className={`${theme.font.body} front-title`}
          style={{ color: theme.colors.secondary }}
          title={data.title || 'Your Title'}
        >
          {data.title || 'Your Title'}
        </p>
        
        {/* Company */}
        <p 
          className={`${theme.font.body} front-company`}
          style={{ color: theme.colors.primary }}
          title={data.company || 'Your Company'}
        >
          {data.company || 'Your Company'}
        </p>
      </div>
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





  // Render custom design if provided
  if (customDesign) {
    return (
      <div 
        className={`${className}`}
        style={{
          width: customDesign.cardSize.width,
          height: customDesign.cardSize.height,
          backgroundColor: customDesign.background.color,
          position: 'relative',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
        }}
      >
        {customDesign.elements.map((element) => {
          if (!element.visible) return null;
          
          const getElementContent = () => {
            switch (element.type) {
              case 'name':
                return data.name || 'Your Name';
              case 'title':
                return data.title || 'Your Title';
              case 'company':
                return data.company || 'Your Company';
              case 'phone':
                return data.phone || 'Your Phone';
              case 'email':
                return data.email || 'Your Email';
              case 'website':
                return data.website || 'Your Website';
              case 'linkedin':
                return data.linkedin || 'Your LinkedIn';
              case 'address':
                return data.address || 'Your Address';
              case 'logo':
                return data.logo ? (
                  <img src={data.logo} alt="Logo" className="w-full h-full object-contain" />
                ) : 'No Logo';
              case 'profileImage':
                return data.profileImage ? (
                  <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
                ) : 'No Image';
              default:
                return '';
            }
          };

          return (
            <div
              key={element.id}
              className="absolute"
              style={{
                left: element.position.x,
                top: element.position.y,
                width: element.size.width,
                height: element.size.height,
                fontSize: element.style.fontSize,
                fontWeight: element.style.fontWeight,
                color: element.style.color,
                textAlign: element.style.textAlign,
                fontFamily: element.style.fontFamily,
                opacity: element.style.opacity,
                transform: `rotate(${element.style.rotation}deg)`,
                zIndex: element.zIndex,
                display: 'flex',
                alignItems: 'center',
                justifyContent: element.style.textAlign === 'center' ? 'center' : 
                               element.style.textAlign === 'right' ? 'flex-end' : 'flex-start',
              }}
            >
              {getElementContent()}
            </div>
          );
        })}
      </div>
    );
  }

  // Return dual cards by default, fallback to original layouts
  return renderDualCards();
};

export default BusinessCard; 