import type { Product } from '../types/product';
import type { Hotel } from '../types/hotel';
import type { CuelinksCampaign } from '../types/cuelinks';

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'iphone-15-128',
    title: 'Apple iPhone 15 (128GB)',
    searchTerm: 'Apple iPhone 15 128GB',
    category: 'Mobiles',
    rating: 4.6,
    reviewsCount: '14.2k',
    bestPrice: 57999,
    originalPrice: 69900,
    discountPercent: 17,
    storeCount: 12,
    badge: 'Best Price',
    colors: [
      { name: 'Black', hex: '#26292b', img: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80' },
      { name: 'Pink', hex: '#ffd0d6', img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80' },
      { name: 'Blue', hex: '#d2e3eb', img: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80' },
      { name: 'Green', hex: '#d6e8d8', img: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80' },
      { name: 'Yellow', hex: '#faefc6', img: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&auto=format&fit=crop&q=80' }
    ],
    stores: [
      {
        name: 'Amazon',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        price: 57999,
        delivery: 'Free Delivery | 1-2 Days (Prime)',
        isBestDeal: true,
        dealBadge: 'Lowest Price',
        directUrl: 'https://www.amazon.in/dp/B0CHX1W1XY'
      },
      {
        name: 'Flipkart',
        logo: 'https://seeklogo.com/images/F/flipkart-logo-3F33927DAA-seeklogo.com.png',
        price: 58999,
        delivery: 'Free Delivery | 2-3 Days',
        isBestDeal: false,
        directUrl: 'https://www.flipkart.com/search?q=Apple+iPhone+15+128GB'
      },
      {
        name: 'Croma',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Croma_Logo.png',
        price: 61990,
        delivery: 'Express Delivery | Same Day Store Pickup',
        isBestDeal: false,
        directUrl: 'https://www.croma.com/searchB?q=Apple+iPhone+15+128GB'
      },
      {
        name: 'Reliance Digital',
        logo: 'https://seeklogo.com/images/R/reliance-digital-logo-56B3A9B26D-seeklogo.com.png',
        price: 62990,
        delivery: 'Free Delivery | 2-4 Days',
        isBestDeal: false,
        directUrl: 'https://www.reliancedigital.in/search?q=Apple+iPhone+15+128GB'
      },
      {
        name: 'Vijay Sales',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Vijay_Sales_logo.png',
        price: 63490,
        delivery: 'Free Delivery | 3-5 Days',
        isBestDeal: false,
        directUrl: 'https://www.vijaysales.com/search/Apple-iPhone-15-128GB'
      }
    ],
    history: {
      '1M': [
        { label: '4 Wks Ago', price: 61999 },
        { label: '3 Wks Ago', price: 59999 },
        { label: '2 Wks Ago', price: 58499 },
        { label: 'Today', price: 57999 }
      ],
      '3M': [
        { label: 'Sep 24', price: 64999 },
        { label: 'Oct 24 (Sale)', price: 54999 },
        { label: 'Nov 24', price: 57999 }
      ],
      '6M': [
        { label: 'Jun 24', price: 71900 },
        { label: 'Jul 24', price: 69900 },
        { label: 'Aug 24', price: 66900 },
        { label: 'Sep 24', price: 64900 },
        { label: 'Oct 24', price: 54999 },
        { label: 'Nov 24', price: 57999 }
      ],
      '1Y': [
        { label: 'Nov 23', price: 79900 },
        { label: 'Feb 24', price: 74900 },
        { label: 'May 24', price: 71900 },
        { label: 'Oct 24', price: 54999 },
        { label: 'Nov 24', price: 57999 }
      ]
    },
    lowestEver: { price: 54999, date: 'Oct 2024 Festival Sale' },
    specs: {
      'Display': '6.1-inch Super Retina XDR OLED, Dynamic Island',
      'Chip': 'Apple A16 Bionic (6-Core CPU, 5-Core GPU)',
      'Camera': '48MP Main (2x Telephoto) + 12MP Ultra-Wide',
      'Charging': 'USB-C (up to 20W wired), MagSafe wireless',
      'OS': 'iOS 18 with Apple Intelligence compatibility'
    }
  },
  {
    id: 'samsung-s23-128',
    title: 'Samsung Galaxy S23 5G (128GB)',
    searchTerm: 'Samsung Galaxy S23 5G',
    category: 'Mobiles',
    rating: 4.6,
    reviewsCount: '11.8k',
    bestPrice: 43999,
    originalPrice: 74999,
    discountPercent: 41,
    storeCount: 9,
    badge: '41% OFF',
    colors: [
      { name: 'Phantom Black', hex: '#1c1c1e', img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80' },
      { name: 'Cream', hex: '#f6f4eb', img: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&auto=format&fit=crop&q=80' }
    ],
    stores: [
      { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', price: 43999, delivery: 'Free Delivery | 1-2 Days', isBestDeal: true, directUrl: 'https://www.amazon.in/s?k=Samsung+Galaxy+S23+5G' },
      { name: 'Flipkart', logo: 'https://seeklogo.com/images/F/flipkart-logo-3F33927DAA-seeklogo.com.png', price: 44999, delivery: 'Free Delivery | 2-4 Days', isBestDeal: false, directUrl: 'https://www.flipkart.com/search?q=Samsung+Galaxy+S23+5G' },
      { name: 'Samsung Shop', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', price: 49999, delivery: 'Official Samsung Warranty | 2-3 Days', isBestDeal: false, directUrl: 'https://www.samsung.com/in/search/?searchvalue=Galaxy%20S23' },
      { name: 'Croma', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Croma_Logo.png', price: 51990, delivery: 'Free Delivery | Store Pickup Available', isBestDeal: false, directUrl: 'https://www.croma.com/searchB?q=Samsung+Galaxy+S23' }
    ],
    history: {
      '6M': [
        { label: 'Jun', price: 54999 },
        { label: 'Aug', price: 49999 },
        { label: 'Oct', price: 39999 },
        { label: 'Nov', price: 43999 }
      ]
    },
    lowestEver: { price: 39999, date: 'Oct 2024' },
    specs: { 'Display': '6.1-inch Dynamic AMOLED 2X 120Hz', 'Processor': 'Snapdragon 8 Gen 2 for Galaxy', 'Camera': '50MP + 12MP + 10MP Telephoto 3x Optical' }
  },
  {
    id: 'macbook-air-m2',
    title: 'Apple MacBook Air M2 (8GB / 256GB SSD)',
    searchTerm: 'Apple MacBook Air M2 256GB',
    category: 'Laptops',
    rating: 4.8,
    reviewsCount: '9.8k',
    bestPrice: 79990,
    originalPrice: 99900,
    discountPercent: 20,
    storeCount: 11,
    badge: 'Popular',
    colors: [
      { name: 'Midnight', hex: '#2b303a', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80' },
      { name: 'Starlight', hex: '#e9e4db', img: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=80' },
      { name: 'Space Grey', hex: '#7d7e80', img: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80' }
    ],
    stores: [
      { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', price: 79990, delivery: 'Free Delivery | 1-2 Days (Prime)', isBestDeal: true, directUrl: 'https://www.amazon.in/s?k=Apple+MacBook+Air+M2' },
      { name: 'Flipkart', logo: 'https://seeklogo.com/images/F/flipkart-logo-3F33927DAA-seeklogo.com.png', price: 81990, delivery: 'Free Delivery | 2-4 Days', isBestDeal: false, directUrl: 'https://www.flipkart.com/search?q=Apple+MacBook+Air+M2' },
      { name: 'Croma', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Croma_Logo.png', price: 86900, delivery: 'Free Delivery | 2-3 Days', isBestDeal: false, directUrl: 'https://www.croma.com/searchB?q=MacBook+Air+M2' },
      { name: 'Reliance Digital', logo: 'https://seeklogo.com/images/R/reliance-digital-logo-56B3A9B26D-seeklogo.com.png', price: 89900, delivery: 'Free Delivery | 3-5 Days', isBestDeal: false, directUrl: 'https://www.reliancedigital.in/search?q=MacBook+Air+M2' }
    ],
    history: {
      '6M': [
        { label: 'May', price: 89900 },
        { label: 'Jul', price: 84990 },
        { label: 'Sep', price: 79990 },
        { label: 'Nov', price: 79990 }
      ]
    },
    lowestEver: { price: 69990, date: 'Oct 2024 Festival Sale' },
    specs: { 'Display': '13.6-inch Liquid Retina Display', 'Processor': 'Apple M2 with 8-Core CPU & 8-Core GPU', 'Battery': 'Up to 18 Hours Battery Life' }
  },
  {
    id: 'sony-wh1000xm5',
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    searchTerm: 'Sony WH 1000XM5',
    category: 'Electronics',
    rating: 4.7,
    reviewsCount: '7.6k',
    bestPrice: 26990,
    originalPrice: 34990,
    discountPercent: 23,
    storeCount: 8,
    badge: 'Price Drop',
    colors: [
      { name: 'Black', hex: '#1a1a1a', img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80' },
      { name: 'Silver', hex: '#e3e3dc', img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80' }
    ],
    stores: [
      { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', price: 26990, delivery: 'Free Delivery | 1-2 Days', isBestDeal: true, directUrl: 'https://www.amazon.in/s?k=Sony+WH-1000XM5' },
      { name: 'Flipkart', logo: 'https://seeklogo.com/images/F/flipkart-logo-3F33927DAA-seeklogo.com.png', price: 27490, delivery: 'Free Delivery | 2-3 Days', isBestDeal: false, directUrl: 'https://www.flipkart.com/search?q=Sony+WH-1000XM5' },
      { name: 'Croma', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Croma_Logo.png', price: 29990, delivery: 'Free Delivery | 2-4 Days', isBestDeal: false, directUrl: 'https://www.croma.com/searchB?q=Sony+WH-1000XM5' },
      { name: 'Reliance Digital', logo: 'https://seeklogo.com/images/R/reliance-digital-logo-56B3A9B26D-seeklogo.com.png', price: 30990, delivery: 'Free Delivery | 2-5 Days', isBestDeal: false, directUrl: 'https://www.reliancedigital.in/search?q=Sony+WH-1000XM5' }
    ],
    history: {
      '6M': [
        { label: 'Jun', price: 31990 },
        { label: 'Aug', price: 29990 },
        { label: 'Oct', price: 24990 },
        { label: 'Nov', price: 26990 }
      ]
    },
    lowestEver: { price: 24990, date: 'Oct 2024' },
    specs: { 'Noise Cancelling': 'Industry Leading Auto NC with 8 Microphones', 'Battery': '30 Hours Playback with Quick Charge', 'Audio': 'Hi-Res Audio Wireless LDAC' }
  },
  {
    id: 'dell-inspiron-15',
    title: 'Dell Inspiron 15 Laptop (Intel Core i5 12th Gen, 16GB, 512GB)',
    searchTerm: 'Dell Inspiron 15 3520 i5',
    category: 'Laptops',
    rating: 4.4,
    reviewsCount: '5.3k',
    bestPrice: 44990,
    originalPrice: 59990,
    discountPercent: 25,
    storeCount: 6,
    badge: 'Popular',
    colors: [
      { name: 'Platinum Silver', hex: '#cfd2d6', img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80' }
    ],
    stores: [
      { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', price: 44990, delivery: 'Free Delivery | 2-4 Days', isBestDeal: true, directUrl: 'https://www.amazon.in/s?k=Dell+Inspiron+15+3520+i5' },
      { name: 'Flipkart', logo: 'https://seeklogo.com/images/F/flipkart-logo-3F33927DAA-seeklogo.com.png', price: 46490, delivery: 'Free Delivery | 3-5 Days', isBestDeal: false, directUrl: 'https://www.flipkart.com/search?q=Dell+Inspiron+15+i5' },
      { name: 'Dell Online', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg', price: 48490, delivery: 'Official Dell Warranty | 4-7 Days', isBestDeal: false, directUrl: 'https://www.dell.com/en-in/search/inspiron-15' }
    ],
    history: {
      '6M': [
        { label: 'Jul', price: 51990 },
        { label: 'Sep', price: 47990 },
        { label: 'Nov', price: 44990 }
      ]
    },
    lowestEver: { price: 42990, date: 'Oct 2024' },
    specs: { 'Processor': 'Intel Core i5-1235U (10 Cores, up to 4.4 GHz)', 'RAM & SSD': '16GB DDR4, 512GB PCIe NVMe M.2 SSD', 'Screen': '15.6" FHD 120Hz Anti-Glare' }
  },
  {
    id: 'boat-airdopes-141',
    title: 'boAt Airdopes 141 ANC TWS Earbuds (42H Playtime)',
    searchTerm: 'boAt Airdopes 141 ANC',
    category: 'Electronics',
    rating: 4.3,
    reviewsCount: '28.4k',
    bestPrice: 1199,
    originalPrice: 1999,
    discountPercent: 40,
    storeCount: 5,
    badge: '40% OFF',
    colors: [
      { name: 'Active Black', hex: '#111', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80' }
    ],
    stores: [
      { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', price: 1199, delivery: 'Free Delivery | Tomorrow (Prime)', isBestDeal: true, directUrl: 'https://www.amazon.in/s?k=boAt+Airdopes+141+ANC' },
      { name: 'Flipkart', logo: 'https://seeklogo.com/images/F/flipkart-logo-3F33927DAA-seeklogo.com.png', price: 1299, delivery: 'Free Delivery | 2 Days', isBestDeal: false, directUrl: 'https://www.flipkart.com/search?q=boAt+Airdopes+141+ANC' },
      { name: 'boAt Store', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Boat_Logo.png', price: 1499, delivery: 'Official boAt Store | 3 Days', isBestDeal: false, directUrl: 'https://www.boat-lifestyle.com/search?q=Airdopes+141' }
    ],
    history: {
      '6M': [
        { label: 'Jul', price: 1499 },
        { label: 'Sep', price: 1299 },
        { label: 'Nov', price: 1199 }
      ]
    },
    lowestEver: { price: 999, date: 'Oct 2024' },
    specs: { 'Noise Cancellation': 'Up to 32dB Active Noise Cancellation', 'Battery': 'Up to 42 Hours Total Playback with ASAP Charge', 'Water Resistance': 'IPX5 Sweat & Water Resistant' }
  },
  {
    id: 'nike-winflo-shoes',
    title: 'Nike Air Winflo 10 Running Shoes for Men',
    searchTerm: 'Nike Air Winflo 10',
    category: 'Footwear',
    rating: 4.5,
    reviewsCount: '4.8k',
    bestPrice: 4199,
    originalPrice: 6995,
    discountPercent: 40,
    storeCount: 6,
    badge: '40% OFF',
    colors: [
      { name: 'Black/White', hex: '#222', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80' }
    ],
    stores: [
      { name: 'Myntra', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Myntra_logo.png', price: 4199, delivery: 'Free Delivery | 2-4 Days', isBestDeal: true, directUrl: 'https://www.myntra.com/nike-winflo-10' },
      { name: 'Flipkart', logo: 'https://seeklogo.com/images/F/flipkart-logo-3F33927DAA-seeklogo.com.png', price: 4499, delivery: 'Free Delivery | 3-5 Days', isBestDeal: false, directUrl: 'https://www.flipkart.com/search?q=Nike+Air+Winflo+10' },
      { name: 'Nike India', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg', price: 6995, delivery: 'Official Nike Store', isBestDeal: false, directUrl: 'https://www.nike.com/in/w?q=winflo%2010' }
    ],
    history: {
      '6M': [
        { label: 'Jun', price: 5495 },
        { label: 'Aug', price: 4895 },
        { label: 'Nov', price: 4199 }
      ]
    },
    lowestEver: { price: 3899, date: 'Oct 2024' },
    specs: { 'Cushioning': 'Full-length Nike Air Unit for resilient stride', 'Upper': 'Engineered mesh with internal fit band', 'Outsole': 'Modified Waffle pattern rubber for traction' }
  }
];

export const FALLBACK_HOTELS: Hotel[] = [
  {
    id: 'taj-exotica-goa',
    name: 'Taj Exotica Resort & Spa',
    city: 'Goa',
    location: 'Benaulim, Goa • Beachfront (Direct Beach Access)',
    rating: 4.8,
    reviewsCount: '2.5k reviews',
    lowestPrice: 14500,
    originalPrice: 19500,
    discountPercent: 26,
    tag: 'Luxury 5-Star',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
    amenities: ['Private Beach', 'Outdoor Pool', 'Jiva Spa', 'Fine Dining', 'Tennis Courts'],
    rates: [
      { ota: 'Booking.com', price: 14500, isLowest: true, directUrl: 'https://www.booking.com/hotel/in/taj-exotica-resort-spa-goa.html' },
      { ota: 'Agoda', price: 15200, isLowest: false, directUrl: 'https://www.agoda.com/en-in/taj-exotica-resort-spa-goa/hotel/goa-in.html' },
      { ota: 'MakeMyTrip', price: 15999, isLowest: false, directUrl: 'https://www.makemytrip.com/hotels/taj_exotica_resort_spa_goa-details-goa.html' },
      { ota: 'Expedia', price: 16400, isLowest: false, directUrl: 'https://www.expedia.co.in/Goa-Hotels-Taj-Exotica-Resort-Spa-Goa.h541999.Hotel-Information' }
    ]
  },
  {
    id: 'novotel-goa-resort',
    name: 'Novotel Goa Resort & Spa',
    city: 'Goa',
    location: 'Candolim, Goa • 1.2 km from Candolim Beach',
    rating: 4.5,
    reviewsCount: '1.9k reviews',
    lowestPrice: 6899,
    originalPrice: 9999,
    discountPercent: 31,
    tag: 'Best Value',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80',
    amenities: ['Pool Bar', 'Spa by Warren Tricomi', 'Kids Club', 'Fitness Center'],
    rates: [
      { ota: 'Booking.com', price: 6899, isLowest: true, directUrl: 'https://www.booking.com/hotel/in/novotel-goa-resort-spa.html' },
      { ota: 'Agoda', price: 7299, isLowest: false, directUrl: 'https://www.agoda.com/en-in/novotel-goa-resort-spa/hotel/goa-in.html' },
      { ota: 'MakeMyTrip', price: 7999, isLowest: false, directUrl: 'https://www.makemytrip.com/hotels/novotel_goa_resort_spa-details-goa.html' }
    ]
  },
  {
    id: 'zuri-white-sands',
    name: 'The Zuri White Sands Resort & Casino',
    city: 'Goa',
    location: 'Varca Beach, Goa • Direct Beachfront',
    rating: 4.4,
    reviewsCount: '1.4k reviews',
    lowestPrice: 5999,
    originalPrice: 8999,
    discountPercent: 33,
    tag: 'Casino & Beach',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80',
    amenities: ['Casino', 'Waterfall Pool', 'Dunes Bar', 'Maya Spa', 'Beach Shacks'],
    rates: [
      { ota: 'Booking.com', price: 5999, isLowest: true, directUrl: 'https://www.booking.com/hotel/in/the-zuri-white-sands-goa-resort-casino.html' },
      { ota: 'Agoda', price: 6450, isLowest: false, directUrl: 'https://www.agoda.com/en-in/the-zuri-white-sands-goa-resort-casino/hotel/goa-in.html' },
      { ota: 'Expedia', price: 6999, isLowest: false, directUrl: 'https://www.expedia.co.in/Hotel-Search?destination=Goa' }
    ]
  }
];

export const FALLBACK_OFFERS: CuelinksCampaign[] = [
  {
    id: 'cuelinks-131869',
    campaign: 'boAt',
    title: 'boAt Grand Festive Sale: Up to 85% Off + Extra 5% with Code!',
    discount: 'Up to 85% OFF',
    couponCode: 'FESTIVE',
    category: 'Electronics',
    tag: 'Verified Deal',
    directUrl: 'https://www.boat-lifestyle.com/pages/grand-festive-sale26',
    trackingUrl: 'https://linksredirect.com/?cid=82192&source=api&url=https%3A%2F%2Fwww.boat-lifestyle.com%2Fpages%2Fgrand-festive-sale26',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80',
    endsIn: 'Ends in 12 days'
  },
  {
    id: 'cuelinks-131875',
    campaign: 'Acer India',
    title: 'Acer Aspire 3 Laptop (8GB RAM, 256GB SSD) at Just ₹28,999!',
    discount: '33% OFF',
    price: 28999,
    origPrice: 42999,
    couponCode: undefined,
    category: 'Laptops',
    tag: 'Lowest Price',
    directUrl: 'https://store.acer.com/en-in/acer-aspire-3-intel-celeron-n4500-processor-laptop',
    trackingUrl: 'https://linksredirect.com/?cid=82192&source=api&url=https%3A%2F%2Fstore.acer.com',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80',
    endsIn: 'Ends in 14 days'
  },
  {
    id: 'cuelinks-131887',
    campaign: 'Campus Shoes',
    title: 'Campus Shoes Festive Offer: Buy 2 & Get Flat 15% Off Sitewide!',
    discount: '15% Extra OFF',
    couponCode: 'FEST15',
    category: 'Footwear',
    tag: 'Coupon Available',
    directUrl: 'https://www.campusshoes.com/',
    trackingUrl: 'https://linksredirect.com/?cid=82192&source=api&url=https%3A%2F%2Fwww.campusshoes.com%2F',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80',
    endsIn: 'Ends in 10 days'
  },
  {
    id: 'cuelinks-131910',
    campaign: 'Havells',
    title: 'Havells Alkaline Water Purifiers: Up to 49% Off, Starting ₹15,160',
    discount: 'Up to 49% OFF',
    price: 15160,
    origPrice: 29750,
    couponCode: undefined,
    category: 'Home Appliances',
    tag: 'Limited Stock',
    directUrl: 'https://havells.com/home-appliances/water-purifier.html',
    trackingUrl: 'https://linksredirect.com/?cid=82192&source=api&url=https%3A%2F%2Fhavells.com',
    image: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=500&auto=format&fit=crop&q=80',
    endsIn: 'Ends in 8 days'
  },
  {
    id: 'cuelinks-131941',
    campaign: 'Firstcry',
    title: 'Firstcry Festive Collection: Flat 50% Off on Kids & Baby Wear!',
    discount: 'Flat 50% OFF',
    couponCode: '50DIYA',
    category: 'Fashion',
    tag: 'Top Coupon',
    directUrl: 'https://www.firstcry.com/topoffers',
    trackingUrl: 'https://linksredirect.com/?cid=82192&source=api&url=https%3A%2F%2Fwww.firstcry.com',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=80',
    endsIn: 'Ends in 6 days'
  }
];

export function getFallbackProducts(params?: { category?: string; q?: string }): Product[] {
  let list = [...FALLBACK_PRODUCTS];
  if (params?.category && params.category !== 'All') {
    list = list.filter((p) => p.category.toLowerCase() === params.category!.toLowerCase());
  }
  if (params?.q) {
    const query = params.q.toLowerCase().trim();
    list = list.filter((p) =>
      p.title.toLowerCase().includes(query) ||
      p.searchTerm.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  }
  return list;
}

export function getFallbackProductById(id: string): Product | undefined {
  return FALLBACK_PRODUCTS.find((p) => p.id === id);
}

export function getFallbackHotels(city?: string): Hotel[] {
  if (city) {
    const q = city.toLowerCase().trim();
    return FALLBACK_HOTELS.filter((h) => h.city.toLowerCase().includes(q) || h.location.toLowerCase().includes(q) || h.name.toLowerCase().includes(q));
  }
  return [...FALLBACK_HOTELS];
}

export function getFallbackOffers(category?: string): CuelinksCampaign[] {
  if (category && category !== 'All Deals') {
    return FALLBACK_OFFERS.filter((o) => o.category.toLowerCase() === category.toLowerCase());
  }
  return [...FALLBACK_OFFERS];
}

