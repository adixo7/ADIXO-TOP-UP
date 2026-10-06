export type PhonePlatform = 'android' | 'ios';

export interface PhoneModelGroup {
  brand: string;
  platform: PhonePlatform;
  models: readonly string[];
}

// Curated common models for the mobile SENSI selector, grouped by manufacturer.
export const MOBILE_PHONE_GROUPS: readonly PhoneModelGroup[] = [
  {
    brand: 'Samsung',
    platform: 'android',
    models: [
      'Galaxy A12', 'Galaxy A13', 'Galaxy A14', 'Galaxy A15', 'Galaxy A16',
      'Galaxy A22', 'Galaxy A23', 'Galaxy A24', 'Galaxy A25', 'Galaxy A32',
      'Galaxy A33', 'Galaxy A34', 'Galaxy A35', 'Galaxy A52', 'Galaxy A53',
      'Galaxy A54', 'Galaxy A55', 'Galaxy A56',
      'Galaxy S20', 'Galaxy S20 FE', 'Galaxy S21', 'Galaxy S21 FE',
      'Galaxy S22', 'Galaxy S23', 'Galaxy S23 FE', 'Galaxy S24',
      'Galaxy S24 FE', 'Galaxy S25',
      'Galaxy M12', 'Galaxy M13', 'Galaxy M14', 'Galaxy M21', 'Galaxy M31',
      'Galaxy M32', 'Galaxy M33', 'Galaxy M34', 'Galaxy M35',
      'Galaxy Z Fold 4', 'Galaxy Z Fold 5', 'Galaxy Z Fold 6',
      'Galaxy Z Flip 4', 'Galaxy Z Flip 5', 'Galaxy Z Flip 6',
    ],
  },
  {
    brand: 'Xiaomi / Redmi',
    platform: 'android',
    models: [
      'Redmi 9', 'Redmi 10', 'Redmi 12', 'Redmi 13', 'Redmi 13C', 'Redmi 14C',
      'Redmi Note 10', 'Redmi Note 10S', 'Redmi Note 10 Pro',
      'Redmi Note 11', 'Redmi Note 11S', 'Redmi Note 11 Pro',
      'Redmi Note 12', 'Redmi Note 12 5G', 'Redmi Note 12 Pro', 'Redmi Note 12 Pro+',
      'Redmi Note 13', 'Redmi Note 13 Pro', 'Redmi Note 13 Pro+',
      'Redmi Note 14', 'Redmi Note 14 Pro', 'Redmi Note 14 Pro+',
    ],
  },
  {
    brand: 'POCO',
    platform: 'android',
    models: [
      'POCO C40', 'POCO C55', 'POCO C65', 'POCO M3', 'POCO M4 Pro', 'POCO M5',
      'POCO M6', 'POCO X3', 'POCO X3 Pro', 'POCO X4 Pro', 'POCO X5',
      'POCO X6', 'POCO X6 Pro', 'POCO X7', 'POCO X7 Pro', 'POCO F3',
      'POCO F4', 'POCO F5', 'POCO F5 Pro', 'POCO F6', 'POCO F6 Pro',
    ],
  },
  {
    brand: 'realme',
    platform: 'android',
    models: [
      'realme 8', 'realme 9', 'realme 10', 'realme 11', 'realme 12',
      'realme 13', 'realme 14',
      'realme C11', 'realme C21', 'realme C25', 'realme C30', 'realme C33',
      'realme C35', 'realme C53', 'realme C55', 'realme C61', 'realme C63',
      'realme C65', 'realme C67', 'realme C75',
      'realme Narzo 30', 'realme Narzo 50', 'realme Narzo 60', 'realme Narzo 70',
    ],
  },
  {
    brand: 'OPPO',
    platform: 'android',
    models: [
      'OPPO A16', 'OPPO A17', 'OPPO A18', 'OPPO A38', 'OPPO A54', 'OPPO A57',
      'OPPO A58', 'OPPO A60', 'OPPO A74', 'OPPO A78', 'OPPO A98',
      'OPPO Reno 7', 'OPPO Reno 8', 'OPPO Reno 10', 'OPPO Reno 11',
      'OPPO Reno 12', 'OPPO Reno 13', 'OPPO F19', 'OPPO F21', 'OPPO F23',
    ],
  },
  {
    brand: 'vivo',
    platform: 'android',
    models: [
      'vivo Y15', 'vivo Y16', 'vivo Y17', 'vivo Y20', 'vivo Y21', 'vivo Y22',
      'vivo Y27', 'vivo Y28', 'vivo Y33s', 'vivo Y35', 'vivo Y36',
      'vivo Y100', 'vivo Y200',
      'vivo V20', 'vivo V21', 'vivo V23', 'vivo V25', 'vivo V27', 'vivo V29',
      'vivo V30', 'vivo V40',
    ],
  },
  {
    brand: 'Infinix',
    platform: 'android',
    models: [
      'Infinix Hot 10', 'Infinix Hot 11', 'Infinix Hot 12', 'Infinix Hot 20',
      'Infinix Hot 30', 'Infinix Hot 40', 'Infinix Hot 50',
      'Infinix Note 10', 'Infinix Note 11', 'Infinix Note 12', 'Infinix Note 30',
      'Infinix Note 40', 'Infinix Note 50',
      'Infinix Smart 7', 'Infinix Smart 8', 'Infinix Smart 9',
      'Infinix Zero 20', 'Infinix Zero 30', 'Infinix Zero 40',
      'Infinix GT 10 Pro', 'Infinix GT 20 Pro',
    ],
  },
  {
    brand: 'TECNO',
    platform: 'android',
    models: [
      'TECNO Spark 8', 'TECNO Spark 9', 'TECNO Spark 10', 'TECNO Spark 20',
      'TECNO Spark 30', 'TECNO Spark 40',
      'TECNO Camon 18', 'TECNO Camon 19', 'TECNO Camon 20', 'TECNO Camon 30',
      'TECNO Camon 40',
      'TECNO Pova 4', 'TECNO Pova 5', 'TECNO Pova 6', 'TECNO Pova 7',
    ],
  },
  {
    brand: 'OnePlus',
    platform: 'android',
    models: [
      'OnePlus 8', 'OnePlus 9', 'OnePlus 10 Pro', 'OnePlus 11', 'OnePlus 12',
      'OnePlus 13', 'OnePlus Nord 2', 'OnePlus Nord 3', 'OnePlus Nord 4',
      'OnePlus Nord 5', 'OnePlus Nord CE 2', 'OnePlus Nord CE 3',
      'OnePlus Nord CE 4', 'OnePlus Nord CE 5', 'OnePlus Nord N20',
      'OnePlus Nord N30',
    ],
  },
  {
    brand: 'Google Pixel',
    platform: 'android',
    models: [
      'Pixel 6', 'Pixel 6a', 'Pixel 6 Pro', 'Pixel 7', 'Pixel 7a', 'Pixel 7 Pro',
      'Pixel 8', 'Pixel 8a', 'Pixel 8 Pro', 'Pixel 9', 'Pixel 9a', 'Pixel 9 Pro',
      'Pixel 9 Pro XL', 'Pixel 10', 'Pixel 10 Pro',
    ],
  },
  {
    brand: 'Motorola',
    platform: 'android',
    models: [
      'Moto G32', 'Moto G34', 'Moto G54', 'Moto G55', 'Moto G64', 'Moto G84',
      'Moto G85', 'Motorola Edge 40', 'Motorola Edge 50', 'Motorola Edge 50 Fusion',
    ],
  },
  {
    brand: 'HONOR',
    platform: 'android',
    models: [
      'HONOR X7a', 'HONOR X7b', 'HONOR X8a', 'HONOR X8b', 'HONOR X9a',
      'HONOR X9b', 'HONOR X9c', 'HONOR 90', 'HONOR Magic6 Pro', 'HONOR Magic7 Pro',
    ],
  },
  {
    brand: 'Apple',
    platform: 'ios',
    models: [
      'iPhone XR', 'iPhone XS', 'iPhone XS Max', 'iPhone SE (2nd generation)',
      'iPhone 11', 'iPhone 11 Pro', 'iPhone 11 Pro Max',
      'iPhone 12 mini', 'iPhone 12', 'iPhone 12 Pro', 'iPhone 12 Pro Max',
      'iPhone 13 mini', 'iPhone 13', 'iPhone 13 Pro', 'iPhone 13 Pro Max',
      'iPhone 14', 'iPhone 14 Plus', 'iPhone 14 Pro', 'iPhone 14 Pro Max',
      'iPhone 15', 'iPhone 15 Plus', 'iPhone 15 Pro', 'iPhone 15 Pro Max',
      'iPhone 16', 'iPhone 16 Plus', 'iPhone 16 Pro', 'iPhone 16 Pro Max',
      'iPhone 16e', 'iPhone 17', 'iPhone 17 Air', 'iPhone 17 Pro',
      'iPhone 17 Pro Max', 'iPhone SE (3rd generation)',
    ],
  },
];
