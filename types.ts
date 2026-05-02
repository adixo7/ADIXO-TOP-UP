
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  registeredDate?: string;
}

export interface Package {
  id: string;
  amount: number;
  bonus?: number;
  unit: string;
  price: number;
  oldPrice?: number;
  currency: string;
  isPopular?: boolean;
  isBonus?: boolean;
  category?: string; // New field for grouping
  image?: string; // Image for the package cover
  description?: string;
}

export interface Game {
  id: string;
  name: string;
  category: string;
  image: string;
  banner: string;
  packages: Package[];
  description: string;
  idPlaceholder: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  color: string;
  qrCode?: string;
}

export interface Transaction {
  id: string;
  gameId: string;
  gameName: string;
  playerId: string;
  amount: number;
  unit: string;
  price: number;
  currency?: string;
  paymentMethod: string;
  date: string; // Display string
  timestamp: number; // For status calculation
  status: 'completed' | 'processing' | 'pending' | 'failed';
}
