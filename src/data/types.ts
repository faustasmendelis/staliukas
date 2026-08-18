export type CuisineType =
  | "lithuanian"
  | "italian"
  | "japanese"
  | "french"
  | "georgian"
  | "mexican"
  | "seafood"
  | "steakhouse"
  | "vegetarian"
  | "international";

export type City = "vilnius" | "kaunas" | "klaipeda";

export type Neighborhood =
  | "senamiestis"
  | "naujamiestis"
  | "uzupis"
  | "snpiskes"
  | "paupys";

export type VibeTag =
  | "terrace"
  | "business-lunch"
  | "pet-friendly"
  | "natural-wine"
  | "late-night-kitchen";

export interface BilingualText {
  lt: string;
  en: string;
}

export interface OffPeakDiscount {
  startTime: string;
  endTime: string;
  percentOff: number;
  label: BilingualText;
}

export interface Review {
  author: string;
  rating: number;
  date: string;
  text: BilingualText;
}

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  description: BilingualText;
  cuisine: CuisineType;
  city: City;
  neighborhood?: Neighborhood;
  address: string;
  phone: string;
  priceRange: 1 | 2 | 3;
  rating: number;
  reviewCount: number;
  images: string[];
  menuHighlights: BilingualText[];
  reviews: Review[];
  openingHours: Record<string, string>;
  coordinates: { lat: number; lng: number };
  vibeTags: VibeTag[];
  offPeakDiscount?: OffPeakDiscount;
}

export interface Reservation {
  id: string;
  restaurantId: string;
  restaurantName: string;
  date: string;
  time: string;
  partySize: number;
  guestName: string;
  phone: string;
  email: string;
  specialRequests?: string;
  depositAmount?: number;
  paymentMethod?: string;
  createdAt: string;
}
