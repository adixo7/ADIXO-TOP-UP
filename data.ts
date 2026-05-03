
import { Game, PaymentMethod } from './types';

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'bkash',
    name: 'bKash',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/BKash_logo.svg/512px-BKash_logo.svg.png',
    color: '#D12053'
  },
  {
    id: 'binance',
    name: 'Binance',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Binance_Logo.png',
    color: '#F3BA2F'
  }
];

export const GAMES: Game[] = [
  {
    id: 'ff',
    name: 'Free Fire',
    category: 'Battle Royale',
    image: '/images/free-fire.webp',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop&q=80',
    idPlaceholder: 'Player ID (e.g. 123456789)',
    description: 'Survive to the end in the fast-paced mobile battle royale.',
    packages: [
      { id: 'ff-weekly-mem', amount: 1, unit: 'Weekly Membership', price: 164, currency: 'BDT', category: 'MEMBERSHIP' },
      { id: 'ff-monthly-mem', amount: 1, unit: 'Monthly Membership', price: 811, currency: 'BDT', category: 'MEMBERSHIP' },
      { id: 'ff-weekly-lite', amount: 1, unit: 'Weekly Lite', price: 46, currency: 'BDT', category: 'MEMBERSHIP' },
      { id: 'ff-4x-weekly-lite', amount: 4, unit: 'X Weekly Lite', price: 184, currency: 'BDT', category: 'MEMBERSHIP' },
      { id: 'ff-evo-3', amount: 3, unit: 'Evo Days', price: 77, currency: 'BDT', category: 'MEMBERSHIP' },
      { id: 'ff-evo-7', amount: 7, unit: 'Evo Days', price: 113, currency: 'BDT', category: 'MEMBERSHIP' },
      { id: 'ff-evo-30', amount: 30, unit: 'Evo Days', price: 347, currency: 'BDT', category: 'MEMBERSHIP' },
      
      { id: 'ff-25', amount: 25, unit: 'Diamond', price: 26, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ff-50', amount: 50, unit: 'Diamond', price: 41, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ff-115', amount: 115, unit: 'Diamonds', price: 82, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ff-240', amount: 240, unit: 'Diamonds', price: 164, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ff-355', amount: 355, unit: 'Diamonds', price: 245, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ff-480', amount: 480, unit: 'Diamonds', price: 327, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ff-505', amount: 505, unit: 'Diamonds', price: 347, currency: 'BDT', isPopular: true, category: 'DIAMOND TOPUP' },
      { id: 'ff-610', amount: 610, unit: 'Diamonds', price: 414, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ff-725', amount: 725, unit: 'Diamonds', price: 495, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ff-1240', amount: 1240, unit: 'Diamonds', price: 827, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ff-2530', amount: 2530, unit: 'Diamonds', price: 1653, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ff-5060', amount: 5060, unit: 'Diamonds', price: 3305, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ff-7590', amount: 7590, unit: 'Diamonds', price: 4963, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ff-10120', amount: 10120, unit: 'Diamonds', price: 6620, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ff-12650', amount: 12650, unit: 'Diamonds', price: 8262, currency: 'BDT', category: 'DIAMOND TOPUP' },
      
      { id: 'ff-lvl-6', amount: 6, unit: 'Level Pass', price: 46, currency: 'BDT', category: 'LEVEL UP PASS' },
      { id: 'ff-lvl-10', amount: 10, unit: 'Level Pass', price: 82, currency: 'BDT', category: 'LEVEL UP PASS' },
      { id: 'ff-lvl-15', amount: 15, unit: 'Level Pass', price: 82, currency: 'BDT', category: 'LEVEL UP PASS' },
      { id: 'ff-lvl-20', amount: 20, unit: 'Level Pass', price: 82, currency: 'BDT', category: 'LEVEL UP PASS' },
      { id: 'ff-lvl-25', amount: 25, unit: 'Level Pass', price: 82, currency: 'BDT', category: 'LEVEL UP PASS' },
      { id: 'ff-lvl-30', amount: 30, unit: 'Level Pass', price: 133, currency: 'BDT', category: 'LEVEL UP PASS' },
      { id: 'ff-lvl-full', amount: 1, unit: 'Full Level Up Pass', price: 500, currency: 'BDT', category: 'LEVEL UP PASS' }
    ]
  },
  {
    id: 'mlbb',
    name: 'Mobile Legends',
    category: 'MOBA',
    image: '/images/mobile-legends.webp',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop&q=80',
    idPlaceholder: 'User ID (Zone ID)',
    description: 'The ultimate mobile MOBA experience.',
    packages: [
      { id: 'ml-weekly-elite', amount: 1, unit: 'Elite Weekly Package', price: 105, currency: 'BDT', category: 'MEMBERSHIP' },
      { id: 'ml-monthly-epic', amount: 1, unit: 'Epic Monthly Package', price: 530, currency: 'BDT', category: 'MEMBERSHIP' },
      { id: 'ml-weekly-pass', amount: 1, unit: 'Weekly Pass', price: 200, currency: 'BDT', category: 'MEMBERSHIP' },
      { id: 'ml-twilight-pass', amount: 1, unit: 'Twilight Pass', price: 1040, currency: 'BDT', category: 'MEMBERSHIP' },
      
      { id: 'ml-55-45', amount: 1, unit: '55+45 Diamond', price: 105, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ml-165-135', amount: 1, unit: '165+135 Diamond', price: 305, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ml-275-225', amount: 1, unit: '275+225 Diamond', price: 490, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ml-565-435', amount: 1, unit: '565+435 Diamond', price: 1010, currency: 'BDT', category: 'DIAMOND TOPUP' },
      
      { id: 'ml-11', amount: 11, unit: 'Diamonds', price: 25, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ml-22', amount: 22, unit: 'Diamonds', price: 45, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ml-56', amount: 56, unit: 'Diamonds', price: 110, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ml-112', amount: 112, unit: 'Diamonds', price: 220, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ml-223', amount: 223, unit: 'Diamonds', price: 440, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ml-336', amount: 336, unit: 'Diamonds', price: 660, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ml-570', amount: 570, unit: 'Diamonds', price: 1095, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ml-1163', amount: 1163, unit: 'Diamonds', price: 2190, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ml-2398', amount: 2398, unit: 'Diamonds', price: 4385, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'ml-6042', amount: 6042, unit: 'Diamonds', price: 11020, currency: 'BDT', category: 'DIAMOND TOPUP' }
    ]
  },
  {
    id: 'pubg',
    name: 'PUBG Mobile',
    category: 'Battle Royale',
    image: '/images/pubg-mobile.webp',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop&q=80',
    idPlaceholder: 'Character ID (e.g. 51234567)',
    description: 'The original battle royale mobile experience.',
    packages: [
      { id: 'pubg-rp-50', amount: 1, unit: 'Royale Pass - Lv50', price: 730, currency: 'BDT', category: 'MEMBERSHIP' },
      { id: 'pubg-rp-100', amount: 1, unit: 'Royale Pass - Lv100', price: 1340, currency: 'BDT', category: 'MEMBERSHIP' },
      { id: 'pubg-a16-elite', amount: 1, unit: 'A16 Elite Pass Lv.1-100', price: 1320, currency: 'BDT', category: 'MEMBERSHIP' },
      { id: 'pubg-a16-plus', amount: 1, unit: 'A16 Elite Pass Plus Lv.1-100', price: 3235, currency: 'BDT', category: 'MEMBERSHIP' },
      { id: 'pubg-bonus-pass', amount: 1, unit: 'Bonus Pass Lv1-60', price: 1800, currency: 'BDT', category: 'MEMBERSHIP' },
      
      { id: 'pubg-60', amount: 60, unit: 'PUBG UC', price: 120, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'pubg-120', amount: 120, unit: 'PUBG UC', price: 240, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'pubg-180', amount: 180, unit: 'PUBG UC', price: 360, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'pubg-240', amount: 240, unit: 'PUBG UC', price: 475, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'pubg-325', amount: 325, unit: 'PUBG UC', price: 600, currency: 'BDT', category: 'DIAMOND TOPUP', isPopular: true },
      { id: 'pubg-385', amount: 385, unit: 'PUBG UC', price: 730, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'pubg-660', amount: 660, unit: 'PUBG UC', price: 1200, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'pubg-720', amount: 720, unit: 'PUBG UC', price: 1340, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'pubg-985', amount: 985, unit: 'PUBG UC', price: 1825, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'pubg-1800', amount: 1800, unit: 'PUBG UC', price: 2950, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'pubg-3850', amount: 3850, unit: 'PUBG UC', price: 5875, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'pubg-8100', amount: 8100, unit: 'PUBG UC', price: 11750, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'pubg-16200', amount: 16200, unit: 'PUBG UC', price: 23500, currency: 'BDT', category: 'DIAMOND TOPUP' },
      
      { id: 'pubg-speed-drift', amount: 1, unit: 'SPEED DRIFT Guaranteed', price: 35780, currency: 'BDT', category: 'GENERAL' }
    ]
  },
  {
    id: 'bs',
    name: 'Blood Strike',
    category: 'Battle Royale',
    image: '/images/blood-strike.jpg',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop&q=80',
    idPlaceholder: 'Player ID',
    description: 'Fast-paced striker battle royale with intense tactical combat.',
    packages: [
      { id: 'bs-vsp', amount: 1, unit: 'Value Season Pass', price: 135, currency: 'BDT', category: 'MEMBERSHIP' },
      { id: 'bs-lbw', amount: 1, unit: 'Lucky Bag Week', price: 124, currency: 'BDT', category: 'MEMBERSHIP' },
      { id: 'bs-vpo', amount: 1, unit: 'Valor Pre-Order Offer', price: 240, currency: 'BDT', category: 'MEMBERSHIP' },
      { id: 'bs-uslc', amount: 1, unit: 'Ultra Skin Lucky Chest', price: 59, currency: 'BDT', category: 'MEMBERSHIP' },
      { id: 'bs-spe', amount: 1, unit: 'Strike Pass Elite', price: 455, currency: 'BDT', category: 'MEMBERSHIP' },
      { id: 'bs-spp', amount: 1, unit: 'Strike Pass Premium', price: 1020, currency: 'BDT', category: 'MEMBERSHIP' },
      
      { id: 'bs-lup', amount: 1, unit: 'Level Up Pass', price: 235, currency: 'BDT', category: 'LEVEL UP PASS' },

      { id: 'bs-51', amount: 51, unit: 'Golds', price: 54, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'bs-105', amount: 105, unit: 'Golds', price: 98, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'bs-320', amount: 320, unit: 'Golds', price: 337, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'bs-540', amount: 540, unit: 'Golds', price: 490, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'bs-1100', amount: 1100, unit: 'Golds', price: 975, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'bs-2260', amount: 2260, unit: 'Golds', price: 1950, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'bs-5800', amount: 5800, unit: 'Golds', price: 4880, currency: 'BDT', category: 'DIAMOND TOPUP' },
    ]
  },
  {
    id: 'codm',
    name: 'Call of Duty: Mobile',
    category: 'FPS',
    image: '/images/cod-mobile.png',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop&q=80',
    idPlaceholder: 'Player ID (e.g. 123456789)',
    description: 'The definitive mobile FPS experience.',
    packages: [
      { id: 'codm-80', amount: 80, unit: 'COD Points', price: 132, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'codm-240', amount: 240, unit: 'COD Point', price: 363, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'codm-420', amount: 420, unit: 'COD Points', price: 605, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'codm-880', amount: 880, unit: 'COD Points', price: 1210, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'codm-2400', amount: 2400, unit: 'COD Points', price: 3025, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'codm-5000', amount: 5000, unit: 'COD Points', price: 6050, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'codm-10800', amount: 10800, unit: 'COD Points', price: 12100, currency: 'BDT', category: 'DIAMOND TOPUP' },
      { id: 'codm-weekly', amount: 1, unit: 'Weekly Supply Pass', price: 132, currency: 'BDT', category: 'MEMBERSHIP' },
      { id: 'codm-monthly', amount: 1, unit: 'Monthly Supply Pass', price: 484, currency: 'BDT', category: 'MEMBERSHIP' }
    ]
  },
  {
    id: 'ai-bots',
    name: 'AI BOTS',
    category: 'AI BOTS',
    image: '/images/glory-bots-cover.png',
    banner: '/images/glory-bots-cover.png',
    idPlaceholder: 'Account ID / Details',
    description: 'Advanced AI Bots for your gaming experience.',
    packages: [
      { id: 'regional-elite', amount: 1, unit: 'REGIONAL ELITE', price: 1764, currency: 'BDT', category: 'GLORY PACKAGE', description: 'Guild Lvl 6 + Region Top 100', image: '/assets/Screenshot_2026-02-22_173818_1771878989302.png' },
      { id: 'regional-master', amount: 1, unit: 'REGIONAL MASTER', price: 2268, currency: 'BDT', category: 'GLORY PACKAGE', description: 'Guild Lvl 6 + Region Top 50', isPopular: true, image: '/assets/Screenshot_2026-02-22_173818_1771878989302.png' },
      { id: 'regional-grandmaster', amount: 1, unit: 'REGIONAL GRANDMASTER', price: 3276, currency: 'BDT', category: 'GLORY PACKAGE', description: 'Guild Lvl 7 + Region Top 30', image: '/assets/Screenshot_2026-02-22_173818_1771878989302.png' },
      { id: 'starter-bots', amount: 2, unit: 'STARTER BOTS', price: 1386, currency: 'BDT', category: 'HIRE BOTS', description: '2 Bots for 1 Week', image: '/assets/Screenshot_2026-02-22_173855_1771878989303.png' },
      { id: 'pro-bots', amount: 4, unit: 'GLORY BOTS', price: 2520, currency: 'BDT', category: 'HIRE BOTS', description: '4 Bots for 1 Week', image: '/assets/Screenshot_2026-02-22_173855_1771878989303.png' },
      { id: 'mystery-basic', amount: 4, unit: 'BASIC MYSTERY BOX', price: 252, currency: 'BDT', category: 'MYSTERY BOX', description: '4 BOTS | 50K - 370K GLORY | 100% SAFE', image: '/images/mystery/boxes.png' },
      { id: 'mystery-epic', amount: 4, unit: 'EPIC MYSTERY BOX', price: 504, currency: 'BDT', category: 'MYSTERY BOX', description: '4 BOTS | 350K - 1.2M GLORY | 100% SAFE', image: '/images/mystery/boxes.png' },
      { id: 'mystery-super', amount: 4, unit: 'SUPER MYSTERY BOX', price: 1008, currency: 'BDT', category: 'MYSTERY BOX', description: '4 BOTS | 1.2M - 3.4M GLORY | 100% SAFE', image: '/images/mystery/boxes.png' },
      { id: 'guild-level-5', amount: 5, unit: 'LEVEL 5', price: 550, currency: 'BDT', category: 'GUILD LEVEL UP', description: 'Boost your guild to Level 5' },
      { id: 'guild-level-6', amount: 6, unit: 'LEVEL 6', price: 850, currency: 'BDT', category: 'GUILD LEVEL UP', description: 'Boost your guild to Level 6' },
      { id: 'guild-level-7-bonus', amount: 7, unit: 'LEVEL 7 + 4 WEEK GLORY BONUS', price: 1400, currency: 'BDT', category: 'GUILD LEVEL UP', description: 'Guild Lvl 7 + 4 Weeks Glory Bonus', isBonus: true }
    ]
  },
  {
    id: 'event-bypass',
    name: 'Event Bypass',
    category: 'EVENT BYPASS',
    image: '/images/event-bypass-cover.png',
    banner: '/images/event-bypass-cover.png',
    idPlaceholder: 'Player ID / Account ID',
    description: 'Bypass events and unlock exclusive rewards with our validity packages.',
    packages: [
      { id: 'eb-7', amount: 7, unit: 'Days Validity', price: 250, currency: 'BDT', category: 'EVENT BYPASS', description: '7 Days Event Bypass Access' },
      { id: 'eb-14', amount: 14, unit: 'Days Validity', price: 460, currency: 'BDT', category: 'EVENT BYPASS', description: '14 Days Event Bypass Access', isPopular: true },
      { id: 'eb-30', amount: 30, unit: 'Days Validity', price: 830, currency: 'BDT', category: 'EVENT BYPASS', description: '30 Days Event Bypass Access' },
      { id: 'eb-60', amount: 60, unit: 'Days Validity', price: 1400, currency: 'BDT', category: 'EVENT BYPASS', description: '60 Days Event Bypass Access' }
    ]
  },
  {
    id: 'pc-games',
    name: 'PC Games',
    category: 'PC Games',
    image: '/pc_games_cover.jpg',
    banner: '/pc_games_cover.jpg',
    idPlaceholder: 'Steam/Epic Account Email',
    description: 'Get the best PC games with 30% discount.',
    packages: [
      { id: 'pc-gta-5', amount: 1, unit: 'Grand Theft Auto 5 | GTA V – Premium Online', price: 2254, oldPrice: 2990, currency: 'BDT', category: 'PC GAMES', image: '/images/gta-v.jpg' },
      { id: 'pc-1', amount: 1, unit: 'Red Dead Redemption 2 | RDR 2 | Rockstar Redeem', price: 3299, oldPrice: 6099, currency: 'BDT', category: 'PC GAMES', image: '/images/rdr2.jpg' },
      { id: 'pc-hitman-2', amount: 1, unit: 'Hitman 2: Silent Assassin | Steam Account', price: 890, oldPrice: 2990, currency: 'BDT', category: 'PC GAMES', image: '/images/games/hitman-2.jpg' },
      { id: 'pc-human-fall-flat', amount: 1, unit: 'Human: Fall Flat | Steam Account', price: 1150, oldPrice: 1490, currency: 'BDT', category: 'PC GAMES', image: '/images/games/human-fall-flat.jpg' },
      { id: 'pc-fc-25', amount: 1, unit: 'EA SPORTS FC™ 25 | Steam Account', price: 1250, oldPrice: 8999, currency: 'BDT', category: 'PC GAMES', image: '/images/games/fc-25.jpg' },
      { id: 'pc-ranch-sim', amount: 1, unit: 'Ranch Simulator | Online | Steam Account', price: 1350, currency: 'BDT', category: 'PC GAMES', image: '/images/games/ranch-sim.jpg' },
      { id: 'pc-zero-hour', amount: 1, unit: 'Zero Hour | Steam Key', price: 1450, oldPrice: 1600, currency: 'BDT', category: 'PC GAMES', image: '/images/games/zero-hour.jpg' },
      { id: 'pc-gta-4', amount: 1, unit: 'Grand Theft Auto IV | GTA 4 – The Complete', price: 1790, oldPrice: 2299, currency: 'BDT', category: 'PC GAMES', image: '/images/games/gta-4.jpg' },
      { id: 'pc-re-4', amount: 1, unit: 'Resident Evil 4 | Steam Account', price: 2150, oldPrice: 7490, currency: 'BDT', category: 'PC GAMES', image: '/images/games/re-4.jpg' },
      { id: 'pc-2', amount: 1, unit: 'HITMAN World of Assassination | Epic', price: 3355, oldPrice: 4357, currency: 'BDT', category: 'PC GAMES', image: '/images/hitman.jpg' },
      { id: 'pc-3', amount: 1, unit: 'The Crew™ 2 | Steam Account', price: 3575, oldPrice: 4990, currency: 'BDT', category: 'PC GAMES', image: '/images/the-crew-2.webp' },
      { id: 'pc-4', amount: 1, unit: 'EA SPORTS FC™ 26 | Steam Account', price: 3795, oldPrice: 9250, currency: 'BDT', category: 'PC GAMES', image: '/images/fc-26.jpg' },
      { id: 'pc-5', amount: 1, unit: 'Assetto Corsa Competizione | Steam', price: 3839, oldPrice: 4490, currency: 'BDT', category: 'PC GAMES', image: '/images/assetto-corsa.jpg' },
      { id: 'pc-6', amount: 1, unit: 'Call of Duty : Black Ops III – Zombies Chronicles', price: 4069, oldPrice: 8990, currency: 'BDT', category: 'PC GAMES', image: '/images/black-ops-3.jpg' },
      { id: 'pc-8', amount: 1, unit: 'Watch Dogs: Legion | Steam Account', price: 4179, oldPrice: 6150, currency: 'BDT', category: 'PC GAMES', image: '/images/watch-dogs-legion.webp' },
      { id: 'pc-9', amount: 1, unit: 'Cities: Skylines II | Steam Account', price: 4399, oldPrice: 4890, currency: 'BDT', category: 'PC GAMES', image: '/images/cities-skylines.png' },
      { id: 'pc-10', amount: 1, unit: 'Forza Horizon 5 – Premium Edition | Steam', price: 4399, oldPrice: 7499, currency: 'BDT', category: 'PC GAMES', image: '/images/forza-horizon-5.jpg' },
      { id: 'pc-11', amount: 1, unit: 'Resident Evil 2 | BIOHAZARD RE:2', price: 4949, oldPrice: 5590, currency: 'BDT', category: 'PC GAMES', image: '/images/resident-evil-2.jpg' },
      { id: 'pc-12', amount: 1, unit: 'RESIDENT EVIL 3 | Steam Account', price: 4729, oldPrice: 5650, currency: 'BDT', category: 'PC GAMES', image: '/images/resident-evil-3.jpg' },
      { id: 'pc-13', amount: 1, unit: 'EA SPORTS FC™ 24 | Epic Account', price: 5489, oldPrice: 8990, currency: 'BDT', category: 'PC GAMES', image: '/images/fc-24.jpg' },
      { id: 'pc-14', amount: 1, unit: 'Cyberpunk 2077 | Epic Account', price: 5775, currency: 'BDT', category: 'PC GAMES', image: '/images/cyberpunk-2077.png' },
      { id: 'pc-16', amount: 1, unit: 'Grand Theft Auto: Vice City – The Definitive', price: 6215, oldPrice: 5950, currency: 'BDT', category: 'PC GAMES', image: '/images/gta-vice-city.jpg' },
      { id: 'pc-17', amount: 1, unit: 'Marvel’s Spider-Man 2 | Steam Account', price: 6599, oldPrice: 6890, currency: 'BDT', category: 'PC GAMES', image: '/images/spider-man-2.jpg' },
      { id: 'pc-18', amount: 1, unit: 'The Crew™ Motorfest | Standard Edition | Epic', price: 7205, currency: 'BDT', category: 'PC GAMES', image: '/images/the-crew-motorfest.jpg' },
      { id: 'pc-19', amount: 1, unit: 'God of War | Epic Account', price: 6919, oldPrice: 6750, currency: 'BDT', category: 'PC GAMES', image: '/images/god-of-war.jpg' }
    ]
  }
];
