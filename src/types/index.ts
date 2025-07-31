export interface BusinessCardData {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  linkedin: string;
  address: string;
  logo: string;
  profileImage: string;
}

export interface CardTheme {
  id: string;
  name: string;
  description: string;
  profession: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  font: {
    name: string;
    heading: string;
    body: string;
  };
  layout: 'vertical' | 'horizontal';
}

export interface CardElement {
  id: string;
  type: 'name' | 'title' | 'company' | 'phone' | 'email' | 'website' | 'linkedin' | 'address' | 'logo' | 'profileImage';
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  style: {
    fontSize: number;
    fontWeight: string;
    color: string;
    textAlign: 'left' | 'center' | 'right';
    fontFamily: string;
    opacity: number;
    rotation: number;
  };
  visible: boolean;
  zIndex: number;
}

export interface CustomCardDesign {
  id: string;
  name: string;
  elements: CardElement[];
  background: {
    color: string;
    image?: string;
    gradient?: {
      type: 'linear' | 'radial';
      colors: string[];
      direction?: string;
    };
  };
  cardSize: {
    width: number;
    height: number;
  };
  theme: CardTheme;
  createdAt: number;
  updatedAt: number;
}

export interface CardLayout {
  id: string;
  name: string;
  orientation: 'horizontal' | 'vertical';
  dimensions: {
    width: number;
    height: number;
  };
} 