export interface SizeMeasurement {
  size: string;
  chest: string; // Vòng ngực (cm)
  length: string; // Chiều dài áo (cm)
  shoulder: string; // Rộng vai (cm)
  sleeve: string; // Dài tay (cm)
  recommendedWeight: string; // Cân nặng đề xuất
  recommendedHeight: string; // Chiều cao đề xuất
}

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  khmerName?: string;
  category: 'merch' | 'membership' | 'bundle' | 'service';
  categoryLabel: string;
  price: number; // in USD
  originalPrice?: number;
  khmerPrice?: string; // in KHR (Riels)
  isPreOrder?: boolean;
  preOrderEstimatedDate?: string;
  isPhysical?: boolean; // requires shipping address
  rating?: number;
  reviewsCount?: number;
  inStock?: boolean;
  images: string[];
  thumbnail: string;
  shortDescription: string;
  description: string;
  khmerDescription?: string;
  features: string[];
  specs?: {
    material?: string;
    weight?: string;
    printType?: string;
    fit?: string;
    origin?: string;
  };
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  sizeChart?: SizeMeasurement[];
  badge?: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface OrderCustomerInfo {
  fullName: string;
  email: string;
  phoneNumber?: string;
  shippingAddress?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  discordTag?: string;
  citizenId?: string;
  orderNotes?: string;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  customer: OrderCustomerInfo;
  items: {
    productId: string;
    productName: string;
    thumbnail: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    isPhysical?: boolean;
  }[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  shippingFee: number;
  total: number;
  paymentMethod: 'khqr' | 'card' | 'crypto' | 'paypal';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export const SIZE_CHART_TEE: SizeMeasurement[] = [
  { size: 'S', chest: '104 cm (41")', length: '70 cm (27.5")', shoulder: '48 cm', sleeve: '22 cm', recommendedHeight: '1m55 - 1m65', recommendedWeight: '48 - 58 kg' },
  { size: 'M', chest: '110 cm (43")', length: '72 cm (28.3")', shoulder: '50 cm', sleeve: '23 cm', recommendedHeight: '1m65 - 1m72', recommendedWeight: '58 - 68 kg' },
  { size: 'L', chest: '116 cm (45.5")', length: '75 cm (29.5")', shoulder: '53 cm', sleeve: '24 cm', recommendedHeight: '1m72 - 1m78', recommendedWeight: '68 - 78 kg' },
  { size: 'XL', chest: '122 cm (48")', length: '78 cm (30.7")', shoulder: '56 cm', sleeve: '25 cm', recommendedHeight: '1m78 - 1m85', recommendedWeight: '78 - 88 kg' },
  { size: '2XL', chest: '128 cm (50.5")', length: '81 cm (31.8")', shoulder: '59 cm', sleeve: '26 cm', recommendedHeight: '1m82 - 1m92', recommendedWeight: '88 - 100 kg' },
  { size: '3XL', chest: '134 cm (52.7")', length: '83 cm (32.6")', shoulder: '62 cm', sleeve: '27 cm', recommendedHeight: '1m85+', recommendedWeight: '100 - 115 kg' },
];

export const SIZE_CHART_HOODIE: SizeMeasurement[] = [
  { size: 'M', chest: '118 cm', length: '71 cm', shoulder: '56 cm', sleeve: '60 cm', recommendedHeight: '1m62 - 1m72', recommendedWeight: '55 - 68 kg' },
  { size: 'L', chest: '124 cm', length: '74 cm', shoulder: '59 cm', sleeve: '62 cm', recommendedHeight: '1m72 - 1m80', recommendedWeight: '68 - 80 kg' },
  { size: 'XL', chest: '130 cm', length: '77 cm', shoulder: '62 cm', sleeve: '64 cm', recommendedHeight: '1m80 - 1m88', recommendedWeight: '80 - 92 kg' },
  { size: '2XL', chest: '136 cm', length: '80 cm', shoulder: '65 cm', sleeve: '66 cm', recommendedHeight: '1m85+', recommendedWeight: '92 - 108 kg' },
];

export const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-vtb-cyber-tee-2026',
    slug: 'vtb-official-cyber-tee-2026',
    name: 'VTB Official Cyber Edition Tee 2026',
    khmerName: 'អាវយឺតផ្លូវការ VTB Cyber Edition 2026',
    category: 'merch',
    categoryLabel: 'Official Merchandise',
    price: 32,
    originalPrice: 42,
    khmerPrice: '130,000 ៛',
    isPreOrder: true,
    preOrderEstimatedDate: 'Estimated dispatch: 2-3 weeks / ដឹកជញ្ជូនក្នុងរយៈពេល ២-៣ សប្តាហ៍',
    isPhysical: true,
    rating: 5.0,
    reviewsCount: 148,
    inStock: true,
    badge: 'PRE-ORDER SPECIAL',
    thumbnail: 'https://i.ibb.co/3ykbN57w/vtb-tee-front.jpg',
    images: [
      'https://i.ibb.co/3ykbN57w/vtb-tee-front.jpg',
      'https://i.ibb.co/6c2hT3B1/vtb-tee-back.jpg',
      'https://i.ibb.co/4n51y70L/vtb-tee-tag.jpg',
      'https://i.ibb.co/yFN3XkM0/vtb-tee-model.jpg',
    ],
    shortDescription: 'Limited Edition Official VTB Roleplay streetwear tee with custom cyberpunk glow graphic, heavy 280GSM combed cotton, and woven verification badge.',
    description: 'The definitive streetwear piece for the VTB Roleplay community. Engineered from custom-developed 100% 280GSM heavy combed cotton, this drop features our signature Cyberpunk VTB City skyline and neon typography in reflective silkscreen print on the back, accompanied by our minimalist chest insignia and authentic woven holographic serial tag.',
    khmerDescription: 'អាវយឺតផ្លូវការចំនួនមានកំណត់សម្រាប់សហគមន៍ VTB Roleplay។ ផលិតពីកប្បាសសុទ្ធ 100% គុណភាពខ្ពស់ទម្ងន់ 280GSM ជាមួយការបោះពុម្ពរូបភាព Neon Cyberpunk ឆ្លុះពន្លឺយ៉ាងស្រស់ស្អាត។',
    features: [
      '100% Heavy Combed Organic Cotton (280 GSM) — Ultra Durable & Soft',
      'High-Density Reflective Neon Cyberpunk Back Print with UV-Reactive Ink',
      'Signature Embroidered VTB Cyan Chest Monogram',
      'Oversized Drop-Shoulder Streetwear Fit with Reinforced Ribbed Collar',
      'Numbered Holographic Authenticity Label + Limited Founder Discord Role',
      'Free Worldwide Sticker Pack & Collector Card Included with Every Pre-Order'
    ],
    specs: {
      material: '100% Heavyweight Combed Cotton',
      weight: '280 GSM',
      printType: 'High-Density Reflective Silkscreen & UV Ink',
      fit: 'Oversized Streetwear Relaxed Fit',
      origin: 'Custom Crafted for VTB Roleplay'
    },
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    colors: [
      { name: 'Stealth Black', hex: '#0F1217' },
      { name: 'Cyber Cyan Edition', hex: '#00DCFF' },
      { name: 'Neon White', hex: '#F0F4F8' }
    ],
    sizeChart: SIZE_CHART_TEE
  },
  {
    id: 'prod-vtb-cyber-hoodie-2026',
    slug: 'vtb-stealth-cyber-hoodie-2026',
    name: 'VTB Stealth Heavyweight Cyber Hoodie',
    khmerName: 'អាវរងា VTB Stealth Cyber Hoodie',
    category: 'merch',
    categoryLabel: 'Official Merchandise',
    price: 59,
    originalPrice: 75,
    khmerPrice: '240,000 ៛',
    isPreOrder: true,
    preOrderEstimatedDate: 'Estimated dispatch: 2-3 weeks / ដឹកជញ្ជូនក្នុងរយៈពេល ២-៣ សប្តាហ៍',
    isPhysical: true,
    rating: 4.9,
    reviewsCount: 92,
    inStock: true,
    badge: 'LIMITED EDITION',
    thumbnail: 'https://i.ibb.co/Q3B5Wj59/vtb-hoodie-front.jpg',
    images: [
      'https://i.ibb.co/Q3B5Wj59/vtb-hoodie-front.jpg',
      'https://i.ibb.co/d0hL45rS/vtb-hoodie-back.jpg',
      'https://i.ibb.co/4n51y70L/vtb-tee-tag.jpg'
    ],
    shortDescription: 'Heavy 420GSM French Terry cotton hoodie with custom VTB Cyber embroidery on hood and dual-tone graphic on back.',
    description: 'Engineered for cold nights and late-night server grind sessions. Built from ultra-plush 420GSM French Terry cotton with deep double-lined hood, metallic aglet drawstrings, and reflective neon sleeve typography.',
    khmerDescription: 'អាវរងាកម្រាស់ 420GSM ដ៏កក់ក្តៅ និងមានផាសុកភាពខ្ពស់ ជាមួយការរចនាបែប Cyberpunk ទំនើបទាន់សម័យ។',
    features: [
      '420 GSM Premium French Terry Cotton — Extreme Comfort & Weight',
      'Double-Layer Heavy Hood with Custom Metal Aglets',
      'Kangaroo Pocket with Hidden Zippered Secret Compartment',
      'Subtle Cyan Glow Reflective Sleeve Stamp',
      'Includes Exclusive "VTB Merch Holder" In-Game Ped Cosmetic Jacket'
    ],
    specs: {
      material: '100% French Terry Cotton',
      weight: '420 GSM',
      printType: 'Embroidery & 3D Rubberized Gel Print',
      fit: 'Boxy Heavyweight Fit',
      origin: 'Custom Crafted for VTB Roleplay'
    },
    sizes: ['M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Pitch Black', hex: '#0B0D11' },
      { name: 'Charcoal Grey', hex: '#2A303C' }
    ],
    sizeChart: SIZE_CHART_HOODIE
  },
  {
    id: 'prod-queue-diamond',
    slug: 'diamond-queue-priority',
    name: 'Diamond VIP Queue Priority',
    khmerName: 'សមាជិកភាព Diamond VIP Priority (+140)',
    category: 'membership',
    categoryLabel: 'Queue Priority & Membership',
    price: 140,
    khmerPrice: '570,000 ៛',
    isPreOrder: false,
    isPhysical: false,
    rating: 5.0,
    reviewsCount: 230,
    inStock: true,
    badge: 'POPULAR VIP',
    thumbnail: 'https://prodigyrp.net/assets/diamond.webp',
    images: ['https://prodigyrp.net/assets/diamond.webp'],
    shortDescription: '+140 Queue Priority points for instant server queue jumps, Diamond Discord role, and exclusive website badge.',
    description: 'Skip the long queues and enter the city instantly during peak hours. Stacks with faction & veteran priority.',
    khmerDescription: 'ពិន្ទុអាទិភាពចូលម៉ាស៊ីនមេ +140 ជួយឱ្យអ្នកចូលលេងបានលឿនបំផុតដោយមិនចាំបាច់រង់ចាំយូរ។',
    features: [
      '+140 High Priority Queue Points (Stacks with other bonuses)',
      'Diamond VIP Member Role on Discord & VTB Website',
      'Dedicated Diamond VIP Lounge Discord Channel Access',
      'Priority Support Ticket Handling by Senior Staff',
      'Lifetime Recognition in Server Milestone History'
    ],
    sizes: [],
    colors: []
  },
  {
    id: 'prod-queue-onyx',
    slug: 'onyx-elite-queue-priority',
    name: 'Onyx Elite Founder Priority',
    khmerName: 'សមាជិកភាព Onyx Elite Priority (+250)',
    category: 'membership',
    categoryLabel: 'Queue Priority & Membership',
    price: 250,
    khmerPrice: '1,020,000 ៛',
    isPreOrder: false,
    isPhysical: false,
    rating: 5.0,
    reviewsCount: 65,
    inStock: true,
    badge: 'TOP TIER',
    thumbnail: 'https://prodigyrp.net/assets/onyx.webp',
    images: ['https://prodigyrp.net/assets/onyx.webp'],
    shortDescription: '+250 Supreme Queue Priority — Ultimate instant access at any time with highest founder tier privileges.',
    description: 'The pinnacle of VTB Roleplay membership. Maximum queue skip priority guarantees immediate entrance into Server 1 & VIP servers even at 600+ player capacities.',
    khmerDescription: 'សមាជិកភាពកំពូលកម្រិត Onyx ផ្តល់ពិន្ទុអាទិភាព +250 ចូលលេងភ្លាមៗគ្រប់ពេលវេលា។',
    features: [
      '+250 Maximum Queue Priority (Highest Non-Staff Tier)',
      'Exclusive Onyx Animated Hologram Discord Role',
      'Custom Discord Nickname Color in Community Chat',
      'Invitation to Private Developer & Founder Roundtables',
      'Complimentary Digital In-Game Founder Plate Token'
    ],
    sizes: [],
    colors: []
  },
  {
    id: 'prod-starter-bundle',
    slug: 'vtb-citizen-starter-pack',
    name: 'Citizen Starter Luxury Pack',
    khmerName: 'កញ្ចប់ពលរដ្ឋចាប់ផ្តើម Citizen Starter Pack',
    category: 'bundle',
    categoryLabel: 'Starter Packs & Bundles',
    price: 45,
    originalPrice: 65,
    khmerPrice: '185,000 ៛',
    isPreOrder: false,
    isPhysical: false,
    rating: 4.8,
    reviewsCount: 310,
    inStock: true,
    badge: 'BEST VALUE',
    thumbnail: 'https://studio.prodigyrp.net/api/media/file/Boosting-768x576.webp',
    images: ['https://studio.prodigyrp.net/api/media/file/Boosting-768x576.webp'],
    shortDescription: 'Everything you need to kickstart your journey: $150,000 in-game bank bonus, Starter Sports Sedan, and 30-day Tier 1 Queue Jump.',
    description: 'Fast-track your civilian or criminal career. Receive an instant cash deposit directly into your Maze Bank account along with starter transport and priority access.',
    khmerDescription: 'កញ្ចប់ជំនួយចាប់ផ្តើមដ៏ល្អបំផុត៖ ទទួលបាន $150,000 ក្នុងហ្គេម រថយន្តស្ព័រចាប់ផ្តើម និងអាទិភាពចូលលេង 30 ថ្ងៃ។',
    features: [
      '$150,000 In-Game Bank Cash Deposit (Instantly credited)',
      '1x Starter Sports Vehicle Voucher (Claimable at PDM Dealership)',
      '1x Custom License Plate Registration Voucher',
      '+25 Silver Queue Priority for 30 Days',
      'Starter Smartphone Custom Ringtone & Wallpaper Unlocks'
    ],
    sizes: [],
    colors: []
  },
  {
    id: 'prod-custom-plate',
    slug: 'vtb-custom-vanity-plate',
    name: 'Custom Vanity License Plate Service',
    khmerName: 'សេវាកម្មចុះបញ្ជីស្លាកលេខរថយន្តផ្ទាល់ខ្លួន',
    category: 'service',
    categoryLabel: 'Custom In-Game Services',
    price: 25,
    khmerPrice: '100,000 ៛',
    isPreOrder: false,
    isPhysical: false,
    rating: 4.9,
    reviewsCount: 88,
    inStock: true,
    thumbnail: 'https://studio.prodigyrp.net/api/media/file/Racing-768x576.webp',
    images: ['https://studio.prodigyrp.net/api/media/file/Racing-768x576.webp'],
    shortDescription: 'Register any custom 8-character alphanumeric plate for your vehicle across the city.',
    description: 'Make your vehicle truly one-of-a-kind with a personalized license plate registered in the DMV & Police database.',
    khmerDescription: 'ចុះបញ្ជីស្លាកលេខរថយន្តផ្ទាល់ខ្លួនរហូតដល់ ៨ តួអក្សរស្របច្បាប់ក្នុងទីក្រុង។',
    features: [
      'Custom 1 to 8 Characters Choice (Letters & Numbers)',
      'Legally Registered in Police & Government MDT Database',
      'Transferrable Between Owned Personal Vehicles',
      'Processed within 24 Hours via Discord Ticket'
    ],
    sizes: [],
    colors: []
  }
];
