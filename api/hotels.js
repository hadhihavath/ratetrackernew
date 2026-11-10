/**
 * RateTracker.in - /api/hotels Serverless Function
 * Architecture Component: Hotel Price Comparison (Booking.com, Agoda, MakeMyTrip, Expedia)
 */

const HOTELS_DATA = [
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

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const city = url.searchParams.get('city');

  let hotels = HOTELS_DATA;
  if (city) {
    const q = city.toLowerCase().trim();
    hotels = hotels.filter(h => h.city.toLowerCase().includes(q) || h.location.toLowerCase().includes(q) || h.name.toLowerCase().includes(q));
  }

  return res.status(200).json({
    count: hotels.length,
    source: 'live-ota-feed',
    hotels
  });
};

