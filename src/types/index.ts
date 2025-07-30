export interface BusinessCardData {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  linkedin: string;
  address: string;
  logo?: string;
  profileImage?: string;
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
  layout: 'horizontal' | 'vertical';
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