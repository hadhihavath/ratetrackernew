export interface HotelRate {
  ota: string;
  price: number;
  isLowest: boolean;
  directUrl: string;
}

export interface HotelAmenity {
  name: string;
  icon?: string;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  location: string;
  rating: number;
  reviewsCount: string;
  lowestPrice: number;
  originalPrice: number;
  discountPercent: number;
  tag: string;
  image: string;
  amenities: string[];
  rates: HotelRate[];
}

export interface HotelsResponse {
  hotels: Hotel[];
}